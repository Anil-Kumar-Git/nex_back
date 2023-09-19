

export function MyTemplete(data) {
  return `
<body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
    <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
        style="@import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap');font-family: 'Open Sans', sans-serif;">
        <tr>
            <td>
                <table style="background-color: #f2f3f8; max-width:770px; margin:30px auto;" width="100%" border="0"
                    align="center" cellpadding="0" cellspacing="0">
                    <!-- Email Content -->
                    <tr>
                        <td>
                            <table width="98%" border="0" align="center" cellpadding="0" cellspacing="0"
                                style="max-width:600px; background:#fff; border-radius:3px;padding:0 40px;">
                                <tr>
                                    <td style="height:30px;">&nbsp;</td>
                                </tr>
                                
                                <tr>
                                    <td style="padding-bottom: 20px;">
                                        <table align="center">
                                            <tr>
                                                <td>
                                                <a href="https://www.nexus7995.com/"
                                                          style="text-decoration:none;">
                                                <img style="max-width:180px;" src="https://i.ibb.co/4YsvZNY/nexus-dark-logo.png" alt="nexus-dark-logo" border="0">
                                                </a>
                                                </td>

                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:0 15px; text-align:center; padding-bottom: 25px;">
                                        <h1
                                            style="color:#1e1e2d; font-weight:600; margin:0;font-size:22px;font-family:'Rubik',sans-serif;text-transform: uppercase;">
                                            ${data?.title || ""}</h1>

                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <table cellpadding="0" cellspacing="0" style="width: 100%; border: none;">
                                            <tbody>
                    
                                                <tr>
                                                    <td
                                                        style="padding: 10px 0px 10px 0px;font-size: 15px; font-weight:500; color:rgba(0,0,0,.74);font-family: 'Open Sans', sans-serif;">
                                                       
                                                        <span
                                                        style="font-size: 15px; font-weight:600; color:rgba(0,0,0,.74);font-family: 'Open Sans', sans-serif;">
                                                        Dear ${
                                                          data?.userName || ""
                                                        },</span></td>
                                                </tr>

                                                <tbody style="border: 1px solid #00A7B2; border-radius: 5px;">
                                                ${ data?.subTitle ?` <tr>
                                                <td
                                                    style="padding: 10px 0px 10px 0px;font-size: 14px; font-weight:500; color:rgba(0,0,0,.74);font-family: 'Open Sans', sans-serif;">
                                                    ${
                                                      data?.subTitle ||
                                                      ""
                                                    }</td>
                                            </tr>`: " "}
                                                    <tr>
                                                        <td
                                                            style="padding: 10px 0px 10px 0px;font-size: 14px; font-weight:500; color:rgba(0,0,0,.74);font-family: 'Open Sans', sans-serif;">
                                                            ${
                                                              data?.content ||
                                                              ""
                                                            }</td>
                                                    </tr>
                                                    ${ data?.subContent ?`   <tr>
                                                        <td
                                                            style="padding: 10px 0px 10px 0px;font-size: 14px;  font-weight:500; color:rgba(0,0,0,.74);font-family: 'Open Sans', sans-serif;">
                                                            ${
                                                              data?.subContent ||
                                                              ""
                                                            }</td>
                                                   </tr>`: " "}
                                                    ${ data?.subContent2 ?`<tr>
                                                        <td
                                                            style="padding: 10px 0px 10px 0px;font-size: 14px;  font-weight:500; color:rgba(0,0,0,.74);font-family: 'Open Sans', sans-serif;">
                                                            ${
                                                              data?.subContent2 ||
                                                              ""
                                                            }</td>
                                                   </tr>`: " "}
                                                    ${ data?.subContent3 ?` <tr>
                                                    <td
                                                        style="padding: 10px 0px 10px 0px;font-size: 14px;  font-weight:500; color:rgba(0,0,0,.74);font-family: 'Open Sans', sans-serif;">
                                                        ${
                                                          data?.subContent3 ||
                                                          ""
                                                        }</td>
                                               </tr>`: " "}
                                                ${ data?.subContent4 ?`  <tr>
                                                <td
                                                    style="padding: 10px 0px 10px 0px;font-size: 14px;  font-weight:500; color:rgba(0,0,0,.74);font-family: 'Open Sans', sans-serif;">
                                                    ${
                                                      data?.subContent4 || ""
                                                    }</td>
                                           </tr>`: " "}
                                            ${ data?.subContent5 ?`<tr>
                                                <td
                                                    style="padding: 10px 0px 10px 0px;font-size: 14px;  font-weight:500; color:rgba(0,0,0,.74);font-family: 'Open Sans', sans-serif;">
                                                    ${
                                                      data?.subContent5 || ""
                                                    }</td>
                                           </tr>`: " "}
                                                     ${
                                                       data.link
                                                         ? showButton(data)
                                                         : ""
                                                     }
                                                     ${ data?.contentBelow ?` <tr>
                                                    <td
                                                    style="padding: 10px 0px 10px 0px; font-size: 14px; font-weight:500; color:rgba(0,0,0,.74);font-family: 'Open Sans', sans-serif;">
                                                    ${
                                                      data?.contentBelow || ""
                                                    }</td>
                                                   </tr>`: " "}
                                                    ${ data?.contentBelow2 ?` <tr>
                                                    <td
                                                    style="padding: 10px 0px 10px 0px; font-size: 14px; font-weight:500; color:rgba(0,0,0,.74);font-family: 'Open Sans', sans-serif;">
                                                    ${
                                                      data?.contentBelow2 || ""
                                                    }</td>
                                                   </tr>`: " "}
                                                    ${ data?.contentBelow3 ?` <tr>
                                                    <td
                                                    style="padding: 10px 0px 10px 0px; font-size: 14px; font-weight:500; color:rgba(0,0,0,.74);font-family: 'Open Sans', sans-serif;">
                                                    ${
                                                      data?.contentBelow3 || ""
                                                    }</td>
                                                    
                                                   </tr>`: " "}
                                                </tbody>
                                               
                                                ${ data?.nexusLink ?` <tr>
                                                <td
                                                        style="padding: 10px 0px 10px 0px;font-size: 15px; font-weight:500; color:rgba(0,0,0,.74);font-family: 'Open Sans', sans-serif;">
                                                        <span
                                                            style="font-size: 15px; font-weight:600; color:rgba(0,0,0,.74);font-family: 'Open Sans', sans-serif;">
                                                            ${
                                                              data?.nexusLink ||
                                                              ""
                                                            }</span>
                                                    </td>
                                                  
                                               </tr>`: " "}

                                                ${ data?.bottom ?` <tr>
                                                <td
                                                        style="padding: 10px 0px 10px 0px;font-size: 15px; font-weight:500; color:rgba(0,0,0,.74);font-family: 'Open Sans', sans-serif;">
                                                        <span
                                                            style="font-size: 15px; font-weight:600; color:rgba(0,0,0,.74);font-family: 'Open Sans', sans-serif;">
                                                            ${
                                                              data?.bottom ||
                                                              ""
                                                            }</span>
                                                    </td>
                                                  
                                               </tr>`: " "}                                             
                                                <tr>
                                                <td
                                                style="padding: 10px 0px 10px 0px;font-size: 15px; font-weight:500; color:rgba(0,0,0,.74);font-family: 'Open Sans', sans-serif;">
                                                <span
                                                    style="font-size: 15px; font-weight:600; color:rgba(0,0,0,.74);font-family: 'Open Sans', sans-serif;">
                                                    Best regards,</span>
                                            </td>
                                            </tr>
                                                <tr>
                                                <td
                                                style="padding: 0px 0px 20px 0px;font-size: 15px; font-weight:500; color:rgba(0,0,0,.74);font-family: 'Open Sans', sans-serif;">
                                                <span
                                                    style="font-size: 15px; font-weight:600; color:rgba(0,0,0,.74);font-family: 'Open Sans', sans-serif;">
                                                    The NEXUS Team 🚀🎮🌟</span>
                                            </td>
                                            </tr>
                                            ${ data?.bottomLink ?` <tr>
                                            <td
                                                    style="padding: 0px 0px 20px 0px;font-size: 15px; font-weight:500; color:rgba(0,0,0,.74);font-family: 'Open Sans', sans-serif;">
                                                    <span
                                                        style="font-size: 15px; font-weight:500; color:rgba(0,0,0,.74);font-family: 'Open Sans', sans-serif;">
                                                        ${
                                                          data?.bottomLink ||
                                                          ""
                                                        }</span>
                                                </td>
                                              
                                           </tr>`: " "}   
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td style=" border-top: 1px solid #F8AF00; padding: 20px 0;">
                                        <table align="center">
                                            <tr style="text-align: center; font-size: 14px;" >
                                                <td>This email was sent by Nexus 7995 GmbH, Broichstr. 6a, 51109 Köln, DE.</td>
                                            </tr>
                                            <tr style="text-align: center; font-size: 14px;" >
                                                <td>For general assistance, contact info@nexus7995.com</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>`;

}

const showButton = (data) => {
    if(data.link && data.button){
        return `<tr>
           <td
              style="padding: 15px 0px 15px 0px;font-size: 14px; text-align: center; font-weight:500; color:rgba(0,0,0,.74);font-family: 'Open Sans', sans-serif;">
           <a href= ${data?.link}
                style="background-color: #333333; border: 1.5px solid #F8AF00; border-radius: 50px !important; display: inline-block; padding: 12px 25px; margin-left:5px;text-decoration:none;color: #F8AF00;font-size: 13px;"> ${data?.button}</a>   
          </td>
      </tr>`;
    } 
};

