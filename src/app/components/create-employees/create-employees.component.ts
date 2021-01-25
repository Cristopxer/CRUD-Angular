import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-create-employees',
  templateUrl: './create-employees.component.html',
  styleUrls: ['./create-employees.component.css'],
})
export class CreateEmployeesComponent implements OnInit {
  employeeForm: FormGroup;
  submitted = false;
  loading = false;
  id: string | null;
  modeText: string = 'Create new employee';

  constructor(
    private fb: FormBuilder,
    private employeeServ: EmployeeService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      doc: ['', Validators.required],
      salary: ['', Validators.required],
    });
    this.id = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.editMode();
  }

  onSubmit() {
    this.submitted = true;
    if (this.employeeForm.invalid) {
      return;
    }
    if (this.id === null) {
      this.addEmployee();
    } else {
      this.updateEmployee(this.id);
    }
  }

  addEmployee() {
    this.loading = true;
    const employee: any = {
      name: this.employeeForm.value.name,
      lastname: this.employeeForm.value.lastname,
      doc: this.employeeForm.value.doc,
      salary: this.employeeForm.value.salary,
      creationDate: new Date(),
      updateDate: new Date(),
    };

    this.employeeServ
      .addEmployee(employee)
      .then(() => {
        this.router.navigate(['./list-employees']);
        this.toastr.success(
          'Employee registred succesfully.',
          'Employee saved.',
          {
            timeOut: 2000,
            positionClass: 'toast-bottom-right',
          }
        );
        this.loading = false;
      })
      .catch((error) => {
        console.log(error);
        this.loading = false;
      });
  }

  updateEmployee(id: string) {
    this.loading = true;
    const employee: any = {
      name: this.employeeForm.value.name,
      lastname: this.employeeForm.value.lastname,
      doc: this.employeeForm.value.doc,
      salary: this.employeeForm.value.salary,
      updateDate: new Date(),
    };
    this.employeeServ.updateEmployee(id, employee).then(() => {
      this.loading = false;
      this.toastr.info('Employee updated', 'Entry updated', {
        timeOut: 2000,
        positionClass: 'toast-bottom-right',
      });
      this.router.navigate(['/list-employees']);
    });
  }

  editMode() {
    if (this.id !== null) {
      this.loading = true;
      this.modeText = 'Update employee';
      this.employeeServ.getEmployee(this.id).subscribe((data) => {
        this.employeeForm.setValue({
          name: data.payload.data()['name'],
          lastname: data.payload.data()['lastname'],
          doc: data.payload.data()['doc'],
          salary: data.payload.data()['salary'],
        });
        this.loading = false;
      });
    }
  }
}
