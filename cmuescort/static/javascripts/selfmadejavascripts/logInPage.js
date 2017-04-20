/**
 * Created by Jeremy on 4/2/16.
 */
// function client: define client information including AndrewID, password and so on
//function Client(id,email,fname,lname,password,status) {
//    this.andrewID = id;
//    this.email = email;
//    this.firstname = fname;
//    this.lastname = lname;
//    this.passWord = password;
//    this.sta = status;
//}

var clients=[]; // global variable clients: store clients information when reading them from database

function LogIn(event){
    // deine varaible AndrewID and Password
    var AndrewID = document.getElementById('logInID').value;
    var Password = document.getElementById('logInpassword').value;
    var Status = document.getElementById('logInStatus').value;
    var pass = null;
    $.ajax({
        url:"/loadClient/",success:function(result){
            var clientStrings = result.split(";");
            for (var i=0; i< clientStrings.length-1;i++){
                var clientString = clientStrings[i];
                console.log(clientString);
                var attributeClient = clientString.split(',');
                console.log(attributeClient);
                // maybe a problem here when dataset is large
                if(attributeClient[6]==Status && Status=='Student'){
                    if((attributeClient[0]==AndrewID) && (attributeClient[5]==Password)){
                        var sendInfo = "?AndrewID=" + AndrewID;
                        $.ajax({
                            url:"/clientSession/" +sendInfo,success:function(result){
                                console.log(result);
                            }
                        });
                        console.log('ok');
                        window.location.href='/logIn_student/';
                        pass = 'pass';
                    }
                }
                else if(attributeClient[6]==Status && Status=='Driver'){
                    if((attributeClient[0]==AndrewID) && (attributeClient[5]==Password)){
                        console.log('ok');
                        window.location.href='/logIn_driver/';
                        pass = 'pass';
                    }
                }
                else if(attributeClient[6]==Status && Status == 'Manager'){
                    if((attributeClient[0]==AndrewID) && (attributeClient[5]==Password)){
                        window.location.href='/logIn_manager/';
                        pass='pass';
                    }
                }
            }
        if (pass == null){alert('AndrewID or Password is not right!');}
        }
    })
}

function SignUp(event) {
    // define variables to get value from signup inputs
    var AndrewID = document.getElementById('signUpID').value;
    var Email = document.getElementById('Email').value;
    var FirstName = document.getElementById('FN').value;
    var LastName = document.getElementById('LN').value;
    var Address = document.getElementById('Ad').value;
    var Password = document.getElementById('signUppassword').value;
    var Status = document.getElementById('signUpStatus').value;
    // transmit it to database
    var clientInfo = "?AndrewID=" + AndrewID + "&Email=" + Email
        + "&FirstName=" + FirstName + "&LastName=" + LastName
        + "&Address=" + Address + "&Password=" + Password + "&Status=" + Status;
    $.ajax({
        url: "/addClient/" + clientInfo, success: function (result) {
            console.log(result)
        }
    });
    window.location.href='/';
}

$(document).ready(function(){
    $('#Login').click(LogIn);
    $('#SignUp').click(SignUp);
});


