import React from 'react';
import { Email, Item} from 'react-html-email';
import { getUser } from '../../util/storage';
const header = "https://i.ibb.co/0snCVqq/header.png";
const user = getUser();

const { format, utcToZonedTime} = require("date-fns-tz");

function Confirmation(props){
    console.log(props);
    return(
        <Email title="Thank you for choosing Reitzel!">
            <Item>
                <img src={header}></img>
            </Item>
            <Item>
                <p>Hi {props.customerInfo.FirstName} {props.customerInfo.LastName},</p>
            <br/>
            <p>Thank you for choosing Reitzel Insulation! Here are the details for your booking:</p>
            <p>Job Type: {props.estimateInfo.JobType}</p>
            <p>Date: {format(new Date(props.estimateInfo.startDate),"MMMM do',' yyyy")}</p>
            <p> Approximate Arrival Time:  {format(new Date(props.estimateInfo.startDate),"K:mm")}</p>
            <br />
            </Item>
            <Item>
            Please read the attached pdf for preparing your home.
            </Item>
            <Item>
                <p>
                    This is an automated email. If you have any questions after reading this document, please reply to your rep at {user.Email} or call the office at 519-886-6100.
            Thank you for your business!
                </p>
               <Item>
                  <p>
                  Regards,
                    
            The Reitzel Team  
               </p> 
               </Item>
               
            
            </Item>


        </Email>
    )
}

export default Confirmation;