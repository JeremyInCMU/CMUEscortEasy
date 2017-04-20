from django.shortcuts import render
from django.http import HttpResponse
from cmuescort.apps.myapp.models import Client, ReservedSeat
from cmuescort.apps.myapp.EscortBestRoute import *
from django.core.mail import EmailMessage
import json
############# helper function for the login page ###############

# create function to extract data from database
def logInRequest(request):
    clients = Client.objects.all()  #extract data from database
    result = ''
    for people in clients:
        result = result + people.AndrewID + ','
        result = result + people.Email + ','
        result = result + people.FirstName + ','
        result = result + people.LastName + ','
        result = result + people.Address + ','
        result = result + people.Password + ','
        result = result + people.Status + ';'

    return HttpResponse(result)

# create function to store client info to session
def logInSession(request):
    try:
        andrewID = request.GET["AndrewID"]
        request.session['AndrewID'] = andrewID
        return HttpResponse('Success')

    except:
        return HttpResponse('Fail')

# create function to access data into database
def signUpRequest(request):
    try:
        andrewID = request.GET["AndrewID"]
        email = request.GET["Email"]
        firstName = request.GET["FirstName"]
        lastName = request.GET["LastName"]
        address = request.GET["Address"]
        password = request.GET["Password"]
        status = request.GET["Status"]
        newClient = Client(AndrewID=andrewID,Email=email,FirstName=firstName,Address=address,
                           LastName=lastName,Password=password,Status=status)
        newClient.save()
        return HttpResponse('Success')

    except:
        return HttpResponse('Fail')


######### helper function for the student login page #########
def updateSeats(request):
    seats = ReservedSeat.objects.all()
    sendSeats = ""
    for seat in seats:
        sendSeats = sendSeats + seat.AndrewID + ','
        sendSeats = sendSeats + seat.Date + ','
        sendSeats = sendSeats + seat.Time + ','
        sendSeats = sendSeats + seat.Route + ','
        sendSeats = sendSeats + seat.BusID + ','
        sendSeats = sendSeats + seat.SeatID + ';'

    return HttpResponse(sendSeats)

def askForSession(request):
    try:
        return HttpResponse(request.session['AndrewID'])
    except:
        return HttpResponse('Fail')

def addReservedSeat(request):
    try:
        andrewID = request.session["AndrewID"]
        date = request.GET["Date"]
        time = request.GET["Time"]
        route = request.GET["Route"]
        busID = request.GET["BusID"]
        seatID = request.GET["SeatID"]

        newReservedSeat = ReservedSeat(AndrewID=andrewID,BusID=busID,SeatID=seatID,
                                       Date=date,Time=time,Route=route)
        newReservedSeat.save()
        return HttpResponse('Success')
    except:
        return HttpResponse('Fail')


######### helper function for manager login page #########

def dailyStaCal(request):
    try:
        date = request.GET['Date']
        route = request.GET['Route']
        result = []
        counts = dict()
        seats = ReservedSeat.objects.all()
        for seat in seats:
            if seat.Date == date and seat.Route == route:
               count = 1 + counts.get(seat.Time,0)
               counts[seat.Time] = count
        result.append(counts)
        if len(result)==1 and len(result[0])==0:
            return HttpResponse('null')
        return HttpResponse(json.dumps(result))
    except:
        return HttpResponse('Fail')

def staCal(request):
    try:
        type = request.GET['Type']
        date = request.GET['Date']
        route = request.GET['Route']
        result = []
        counts = dict()
        seats = ReservedSeat.objects.all()
        if type=='daily':
            for seat in seats:
                if seat.Date == date and seat.Route == route:
                   count = 1 + counts.get(seat.Time,0)
                   counts[seat.Time] = count
            result.append(counts)
        elif type=='monthly':
              # change the format of date
            for seat in seats:
                tempDate = seat.Date.split('/')
                tranDate = tempDate[0]+'/'+tempDate[-1]
                if date == tranDate and seat.Route == route:
                   count = 1 + counts.get(date,0)
                   counts[date] = count
            result.append(counts)
        elif type=='yearly':
            for seat in seats:
                tranDate = seat.Date.split('/')[-1]
                if date == tranDate and seat.Route == route:
                   count = 1 + counts.get(date,0)
                   counts[date] = count
            result.append(counts)
        if len(result)==1 and len(result[0])==0:
            return HttpResponse('null')
        return HttpResponse(json.dumps(result))
    except:
        return HttpResponse('Fail')

####### helper function for driver log in page ########
# Automatically and periodically add riders to the web
def addRiders(request):
    try:
        date = request.GET['Date']
        time = request.GET['Time']
        route = request.GET['Route']
        busID = request.GET['BusID']
        seats = ReservedSeat.objects.all()
        result = ""
        for desiredSeat in seats:
            if date == desiredSeat.Date\
                and time == desiredSeat.Time\
                and route==desiredSeat.Route\
                and busID==desiredSeat.BusID:
                clients = Client.objects.all()
                for client in clients:
                    if client.AndrewID == desiredSeat.AndrewID and client.Status == 'Student':
                        result = result + client.AndrewID + ','
                        result = result + client.Address + ';'
        return HttpResponse(result)
    except:
        return HttpResponse('Fail')

# Get Vertexes(pair of positions) and Edges(distance) from
# the web
def transVerAndEdges(request):
    try:
        result = ''
        vertexAndEdges = json.loads(request.GET['vertexAndEdges'])
        desiredData = transDataForm(vertexAndEdges)
        result = result + bestRouteWrapperFunction(desiredData)
        return HttpResponse(result)
    except:
        return HttpResponse('Fail')

# Extract infromation from serveredSeat Table
# then check condiitions. If all the conditions
# are satisfied, the client will be sent email
# to notify the upcoming boarding
def sendEmail(request):
    try:
        date = request.GET['Date']
        time = request.GET['Time']
        route = request.GET['Route']
        busID = request.GET['BusID']
        seats = ReservedSeat.objects.all()
        boardList = []
        for seat in seats:
            if date == seat.Date\
                and time == seat.Time\
                and route== seat.Route\
                and busID== seat.BusID:
                clients = Client.objects.all()
                for client in clients:
                    if client.AndrewID == seat.AndrewID and client.Status == 'Student':
                        boardList.append(client.Email)
        command = 'Your reserved escort will arrive in 10min. Please prepare for boarding.' \
                  'Thanks and Warm Regards!'

        email = EmailMessage('Board Notification', command, 'cmuescort@gmail.com', to=boardList)
        email.send()
        return HttpResponse('send')
    except:

        return HttpResponse('fail')
