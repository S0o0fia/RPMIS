import { Component, OnInit, Inject } from '@angular/core';
import { RequestForInspectionComponent } from '../request-for-inspection/request-for-inspection.component';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Rfi } from 'app/Models/RFI/rfi';
import { PageTitleService } from '../core/page-title/page-title.service';
import { TranslateService } from '@ngx-translate/core';
import { NewItemRFI } from 'app/Models/Items/new-item-rfi';
import { CoreService } from 'app/Service/core/core.service';
import { formatDate } from '@angular/common';
import { InspctionId } from 'app/Models/inspction_id/inspction-id';

@Component({
  selector: 'ms-add-request',
  templateUrl: './add-request.component.html',
  styleUrls: ['./add-request.component.scss']
})
export class AddRequestComponent implements OnInit {

  
  minDate : Date;
  maxDate : Date;
  req_number : string;
  item_number : string;
  item_name : string;
  qty : number;
  types : any =[];
  itemDate : NewItemRFI[]=[];
  typename : number;
  start_work : Date = new Date();
  end_work : Date = new Date();
  insepction_date : Date = new Date();
  quantitys : any = [];
  work_id : string;
  newRFI : Rfi;
  inspection_id : number;
  inspectionIDs : InspctionId;
  constructor(   public dialogRef: MatDialogRef<RequestForInspectionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Rfi,private _snackBar: MatSnackBar
    ,private translate : TranslateService , private  services :CoreService) {
      this.minDate = new Date(1900,1,1);
      this.maxDate = new Date(2050,1,1);
    }
  	//Method to fill the Table of items
    addItem()
    {
      this.itemDate.push({
        rfi_id : 0 ,
        name : this.item_name , 
        num : this.item_number ,
        qty : this.qty
      });
    }

    //this to get the request number from the from 
    request(value)
    {
      this.req_number = value;


    }
    //Method Action To remove item when click on delete icon on items Tables 
    removeitem(index)
    {
      this.itemDate.splice(index , 1);
    }

    //Action Method when click Cancel button
  onNoClick(): void {
    this.dialogRef.close();
  }
 
  
  ngOnInit() {
    //to het the type of work
    this.services.getType_forRFI().subscribe(
      data => this.types = data , 
      err=>console.log(err)
    );
   
    //to get the item fro Qty-tble based on id of work type 
    this.services.getQty_tbl().subscribe(
      data=> this.quantitys = data , 
      err => console.log(err)
    );
    
  }
  
  //to get the selected item name  binding with its number
  BindItemname(value)
  {
    this.item_name = value;
  }

  //to get the seleced item number binding with its name
  BindItemnumber(value)
  {
    this.item_number = value;
  }
  
  //when you click Save Button
  Save()
  {
    const format = 'MM/dd/yyyy';
    const locale = 'en-US';
    let startdate= formatDate(this.start_work, format, locale);
    let endate=formatDate(this.end_work, format, locale);
      let inspectiondate= formatDate(this.insepction_date, format, locale);
      console.log(this.work_id);
     this.newRFI = {
       id : 0 ,
              end_date : startdate,
              inspect_date : endate ,
              request_name:"",    
                     
              request_ids : this.typename , 
              request_num : this.req_number , 
              start_date : inspectiondate ,
              work_location : this.work_id,
              item_name:"",
              item_number:"",
              item_qty : 0
     }

     this.services.createRFi(this.newRFI).subscribe(
       data=> {
                  this.inspectionIDs = data as InspctionId;
                  this.itemDate.forEach(element => {
                    element.rfi_id = this.inspectionIDs.inspection_id ,
                    this.services.createItemRFI(element).subscribe(
                      data=>{
                         //function for calling Stackbar
                        let msg = this.openSnackBar("تم الإضافة بنجاح" , "إالغاء" );
                        if(msg)
                        {
                          location.reload();
                        }
                      },
                      err=>console.log(err)
                    )
                  });
                  
               },
       err=> console.log(err)
     );
     
  }

  //the Stack bar Method 
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition : 'center' ,
      panelClass: ['my-snack-bar']
    });

    return true;
    
  }
}
