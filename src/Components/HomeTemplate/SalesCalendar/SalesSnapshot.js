import React from "react";
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
import Switch from 'devextreme-react/switch';
import Scheduler, {Resource} from 'devextreme-react/scheduler';
import SalesTemplate from './SalesTemplate.js'
import SalesTooltip from './salesTooltip.js';
import {getEstimates, deleteEstimate, getUsers, updateEstimate, getRegionAPI, sendUpdate, findCustomer} from '../../../api/calendar';
import CustomStore from 'devextreme/data/custom_store';
import { Modal } from 'antd';
import UpdateConfirm from '../../Email_Templates/updateConfirm';
import {renderEmail} from 'react-html-email';

const { confirm } = Modal;
const { zonedTimeToUtc, utcToZonedTime, format } = require('date-fns-tz')

const dataSource = new CustomStore({
  key: "EstimateID",
  load: async () => {
    const data = await getEstimates();
    let formatData = data.data.map((item) => ({
      EstimateID : item.EstimateID,
      CustomerID : item.CustomerID,
      AddressID : item.AddressID,
      UserID : item.UserID,
      CreationDate : item.CreationDate,
      text : item.EstimateInfo,
      RegionID : item.RegionID,
      startDate : timeFormat(item.startDate),
      endDate : timeFormat(item.endDate)
    }));
    return formatData
  }
});
const sendEmailUpdate = async (values) => {
  console.log(values);
  let findCustomerEmail = await findCustomer(values.CustomerID);
  console.log(findCustomerEmail);
  let customerEmail = findCustomerEmail.data[0];
  sendUpdate(customerEmail.Email, renderEmail(<UpdateConfirm estimateInfo = {values}/>));
}

const timeFormat = (date) => {
   let newdate = zonedTimeToUtc(new Date(date), 'America/Edmonton');
   var formatteddate = format(newdate, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
   return formatteddate;
}

const timeDeformat = (date) => {
  let newdate = utcToZonedTime(new Date(date), 'America/Edmonton');
  var formatteddate = format(newdate, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
   return formatteddate;
}
const currentDate = new Date();
let date = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();
const views = ['day','workWeek','month'];
const groups = ['UserID'];

const renderResourceCell = (model) => {
  return (
      <b>{model.data.FirstName}</b>
  );
}

class SalesCalendar extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      groupByDate:false,
      cancel:true,
      userList:"",
      regionList:"",
      info:false
    };
    
    this.onGroupByDateChanged = this.onGroupByDateChanged.bind(this);
    this.onAppointmentForm = this.onAppointmentForm.bind(this);
    this.salesmanSource = this.salesmanSource.bind(this);
    this.regionSource = this.regionSource.bind(this);
    this.InfoIsHere = this.InfoIsHere.bind(this);
  }
  async InfoIsHere() {
  let regionData = await this.regionSource();
  let userData = await this.salesmanSource();
  this.setState({userList:userData});
  this.setState({regionList:regionData});
  this.setState({info:true});
} 
  
  onAppointmentForm(args) {
    args.cancel = true;
  }
  onGroupByDateChanged(args) {
    this.setState({
      groupByDate: args.value
    });
  }
  async regionSource() {
    const data = await getRegionAPI();
    let regionData = data.data.map((item) => ({
      id  : item.RegionID,
      region: item.Region,
      color: item.color
    }))
    console.log(regionData);
    return regionData;
  }

  async salesmanSource() {
    const data = await getUsers();
    let salesData = data.data.map((item) => ({
      id: item.UserID,
      FirstName : item.FirstName,
      LastName: item.LastName
    }))
    console.log(salesData);
    return salesData;
  }
  componentDidMount(){
    this.InfoIsHere();
}

 
  render() {
    if (this.state.info == false){
        return (
          <p>Loading information...</p>
        )
      }
      else{

      
    return (
      
      <div>
      <Scheduler
        timeZone="America/Edmonton"
        groups = {groups}
        groupByDate={this.state.groupByDate}
        resourceCellRender={renderResourceCell}
        dataSource={dataSource}
        views={views}
        defaultCurrentView="workWeek"
        defaultCurrentDate={date}
        height={800}
        startDayHour={6}
        endDayHour={21}
        appointmentComponent={SalesTemplate}
        //appointmentTooltipComponent={SalesTooltip}
        onAppointmentAdding={(e) => {e.cancel = true}}
        onAppointmentDeleting={(e) => {e.cancel = true}}
        onAppointmentFormOpening={(e) => {e.cancel = true}}
        onAppointmentUpdating={(e) => {e.cancel = true}}
        >
        <Resource
          dataSource={this.state.userList}
          fieldExpr="UserID"
          >
        </Resource>
        <Resource
          dataSource={this.state.regionList}
          fieldExpr="RegionID"
          useColorAsDefault={true}
        ></Resource>
        </Scheduler>
        <div className="options">
        <div className="caption">Group by Date First</div>
        <div className="option">
          <Switch
            value={ this.state.groupByDate }
            onValueChanged={this.onGroupByDateChanged}
          />
        </div>
      </div>
    </div>
    );
  }
}
}

export default SalesCalendar;