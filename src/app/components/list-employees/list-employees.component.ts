import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-list-employees',
  templateUrl: './list-employees.component.html',
  styleUrls: ['./list-employees.component.css'],
})
export class ListEmployeesComponent implements OnInit {
  employees: any[] = [];

  constructor(
    private employeeServ: EmployeeService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getEmployees();
  }

  getEmployees() {
    this.employeeServ.getEmployees().subscribe((data) => {
      this.employees = [];
      data.forEach((element: any) => {
        this.employees.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data(),
        });
      });      
    });
  }
  deleteEmployee(id: string) {
    this.employeeServ
      .deleteEmployee(id)
      .then(() => {
        this.toastr.error('Employee deleted succesfully!', 'Data deleted', {
          timeOut: 2000,
          positionClass: 'toast-bottom-right',
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
