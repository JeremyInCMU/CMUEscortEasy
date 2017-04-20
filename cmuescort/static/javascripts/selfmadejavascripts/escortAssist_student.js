/**
 * Created by Jeremy on 4/13/16.
 */
/*
 * function seat: define seat objects
 */
function ReservedSeat(AndrewID,BusID,SeatID,Date,Time,Route) {
    this.AndrewID = AndrewID;
    this.BusID = BusID;
    this.SeatID = SeatID;
    this.Date = Date;
    this.Time = Time;
    this.Route = Route;
}

/*
 *  helper function
 */

// this function will update the seats
function updateSeats(event){
    $.ajax({
        url:"/updateSeats/", success:function(result){
            var reservedSeats = result.split(';');
            for(i=0; i < reservedSeats.length-1;i++){
                var attributes = reservedSeats[i].split(',');
                if (attributes[1] == document.getElementById('Date').value &&
                attributes[2] == document.getElementById('Time').value &&
                attributes[3] == document.getElementById('Route').value &&
                attributes[4] == document.getElementById('BusID').value){
                    console.log('OK');
                    document.getElementById(attributes[5]).src = 'https://s3-us-west-2.amazonaws.com/cmuescort/seat_selected.jpg'
                }
                else{
                    document.getElementById(attributes[5]).src = 'https://s3-us-west-2.amazonaws.com/cmuescort/seat_available.jpg'
                }
            }
        }
    })
}

// this function is an event function
// it will be called when user clicks
// on the reserve button
function submitReservation(event) {
    var andrewID = getAndrewID();
    var date = document.getElementById('Date').value;
    var time = document.getElementById('Time').value;
    var route = document.getElementById('Route').value;
    var busID = document.getElementById('BusID').value;
    if(seatID==null){
        alert('You need to select a seat');
    }
    else{
        var transmitReservedSeat = "?Date=" + String(date) + "&Time=" + String(time) + "&Route="
                                 + route + "&BusID=" + busID + "&SeatID=" + seatID;
        $.ajax({
            url: "/addReservedSeat/" + transmitReservedSeat,success: function (result) {
                console.log(result);
            }
        });
    }
}

// get AndrewID from session(cookies)
function getAndrewID(){
    var andrewID = null;
    $.ajax({
      url:"/askForSession/",async:false,success: function(result){
            console.log(result);
            andrewID = result;
        }
    });
    return andrewID
}

// these two global variables are set
// to help the seatSelection function
// check if the selected seat legal
var seatID = null;
var selection = false;


function seatSelection(event){
    console.log(this.id);
    if (this.id!=null) {
        if (this.src.match('seat_available') && selection == false) {
            this.src = 'https://s3-us-west-2.amazonaws.com/cmuescort/seat_reserved.jpg';
            selection = true;
            seatID = this.id;
        }
        else {
            alert('You have already selected a seat');
            document.getElementById(seatID).src = 'https://s3-us-west-2.amazonaws.com/cmuescort/seat_available.jpg';
            seatID = null;
            selection = false;
        }
    }
}

// a helper function for
// seat click event
function checkClick(){
    for(i=1; i<25; i++) {
        $('#' + 'N' + String(i)).click(seatSelection)
    }
}

/*
 * ajax init the webpage
 */
$(document).ready(function(){
    checkClick();
    $('#Reserve').click(submitReservation);
    $('#Date').change(updateSeats);
    $('#Time').change(updateSeats);
    $('#Route').change(updateSeats);
    $('#BusID').change(updateSeats);
});

