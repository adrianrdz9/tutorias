Date.prototype.monthDays = function(){
    var d= new Date(this.getFullYear(), this.getMonth()+1, 0);
    return d.getDate();
}

String.prototype.capitalize = function(){
    return this.charAt(0).toUpperCase() + this.slice(1);
}

class Calendar {
    constructor(){
        this.currentDate = new Date();
        this.today = this.currentDate;
        this.events = [];
        this.prev = this.prev.bind(this);
        this.next = this.next.bind(this);
        this.getEvents = this.getEvents.bind(this);
        this.addEvents();
        this.getEvents();
        this.updateView();
        this.showEvent.bind(this);
    }

    addEvents(){
        document.querySelector("#prev").addEventListener("click", this.prev)
        document.querySelector("#next").addEventListener("click", this.next)
    }

    updateView(){
        moment.locale('es');
        document.querySelector(".dates").innerHTML = "";
        document.querySelector(".monthName").innerHTML = moment(this.currentDate).format("MMMM").capitalize();
        document.querySelector(".year").innerHTML = this.currentDate.getFullYear();
        
        var startingDay = new Date(this.currentDate.getFullYear + "-" + (this.currentDate.getMonth()+1) + "-01").getDay();
        for (let i = 0; i < startingDay-1; i++) {
            document.querySelector(".dates").innerHTML += "<li>X</li>";
        }

        for (let i = 1; i <= this.currentDate.monthDays(); i++) {
            let el = "<li class='";
            if(this.today.getMonth() == this.currentDate.getMonth() && this.today.getFullYear() == this.currentDate.getFullYear() && this.today.getDate() == i){
                el += "active ";
            }
            if(this.events.filter(el => el.date == i).length > 0){
                el+= "activity ";
            }

            el += "'>" + i + "</li>";
            document.querySelector(".dates").innerHTML += el;
        }

        document.querySelectorAll(".activity").forEach((el)=>{
            el.addEventListener("click", (ev)=>{
                this.showEvent(ev.target.innerHTML);
            })
        })
    }

    addEvent(event){
        event.date = event.date.split('-').pop();
        this.events.push(event);
        this.updateView();
    }

    clearEvents(){
        this.events = [];
        this.updateView();
    }

    showEvent(date){
        var events = this.events.filter(el => parseInt(el.date) == date);
        var eventCards = "";

        events.forEach((el)=>{
            eventCards += `
            <div class="card text-center mb-2 border-0">
                <div class="card-header bg-info text-light">
                    `+ el.title  +`
                </div>
                <div class="card-body">
                    `+ el.description +`
                </div>
            </div>
           `
        })
        swal({
           title: "<div class='card-header bg-success text-light border-0'>Tutorías del dia</div>",
           html: eventCards,
           customClass: "bg-transparent",
        })
    }

    prev(){
        this.currentDate = moment(this.currentDate).subtract(1, 'month').toDate();
        this.clearEvents();
        this.getEvents();

    }

    next(){
        this.currentDate = moment(this.currentDate).add(1, 'month').toDate();
        this.clearEvents();
        this.getEvents();
    }

    getEvents(){
        var currentDate = moment(this.currentDate).format("YYYY-MM-DD");

        $.get("/events", {date: currentDate}, function(events){           
            events.forEach(function(ev){
                calendar.addEvent(ev);
            })
        })

        this.updateView();
    }
}
