const model = require("../models/event");
const { DateTime } = require("luxon");
const user = require("../models/user");
const rsvpModel = require("../models/rsvp");

//res.send('send all events');
exports.index = (req, res, next) => {
  model
    .find()
    .then((events) => {
      let categories = [];
      events.forEach((event) => {
        if (!categories.includes(event.category)) {
          categories.push(event.category);
        }
      });
      res.render("./events/index", { events, categories }); // Pass events and categories to the template
    })
    .catch((err) => next(err));
};

//GET/events/new: send html form for creating a new event

exports.new = (req, res) => {
  res.render("./events/new");
};

// POST /events: create a new event
exports.create = (req, res, next) => {
  console.log(req.body, "NEW EVENT");
  let event = new model(req.body);
  event.host = req.session.user;
  event.image = "/images/" + req.file.filename;
  event
    .save()
    .then((result) => {
      req.flash("success", "Event created successfully");
      res.redirect("/events");
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        err.status = 400;
      }
      next(err);
    });
};

//Get /events/:id - Send details of the event identified by id
exports.show = (req, res, next) => {
    let id = req.params.id;
    let User = req.session.user;
    Promise.all([user.findById(User), model.findById(id).populate("host", "firstName lastName").lean(), rsvpModel.find({event: id})])
    .then(result=>{
        let [user, event, rsvp] = result;
    
        if(event){
            let rsvpValue = 0;
            for(let i in rsvp){
                if(rsvp[i].status === "YES"){
                    rsvpValue++;
                }
            }
            console.log(event);
            res.render('./events/show',{event, user, rsvpValue});
            
        } 
        else{
            let err = new Error('Cannot find event with id ' + id);
            err.status = 404;
            next(err);
        } 
    })
    .catch(err=>next(err));
  /*let id = req.params.id;
  let usersession = req.session.user;
  
  Promise.all([
    user.findById(usersession),
    model.findById(id).populate("host", "firstName lastName").lean(),
    rsvpModel.find({ event: id }),
    ])
    .then((result) => {
      let [user, event, rsvp] = result;
      console.log(event);   
      event.startDate = DateTime.fromJSDate(new Date(event.startDate)).toLocaleString(
        DateTime.DATETIME_MED
      );
      event.endDate = DateTime.fromJSDate(new Date(event.endDate)).toLocaleString(
        DateTime.DATETIME_MED
      );
      if (event) {
        let rsvpValue = 0;
        console.log(rsvp);
        for (let i in rsvp) {
          if (rsvp[i].status === "YES") {
            rsvpValue++;
            console.log(rsvpValue);
          }
        }
        res.render("./events/event", { event, user, rsvpValue });
      } else {
        let err = new Error("Cannot find event with id " + id);
        err.status = 404;
        next(err);
      }
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });*/
};

//Get /events/:id/edit - Send the edit form for the event identified by id
exports.edit = (req, res, next) => {
  let id = req.params.id;
  model
    .findById(id)
    .lean()

    .then((event) => {
      if (event) {
        // Parse the start and end dates and format them
        const parsedStartDate = DateTime.fromJSDate(new Date(event.startDate));
        const parsedEndDate = DateTime.fromJSDate(new Date(event.endDate));

        if (parsedEndDate.isValid && parsedStartDate.isValid) {
          event.startDate = parsedStartDate.toFormat("yyyy-MM-dd'T'HH:mm");
          event.endDate = parsedEndDate.toFormat("yyyy-MM-dd'T'HH:mm");

          return res.render("./events/edit", { event }); // Render the edit form
        }
      }
    })
    .catch((err) => next(err)); // Handle any errors from findById
};

// PUT /events/:id - Update the event
exports.update = (req, res, next) => {
  let id = req.params.id;
  let event = req.body;
  //event.image = req.file.filename;
  model
    .findByIdAndUpdate(id, event, { useFindAndModify: false, runValidators: true })
    .then((event) => {
      req.flash("success", "Event updated successfully");
      res.redirect("/events/" + id);
    })
    .catch((err) => {
      if (err.name === "ValidationError") err.status = 400;
      next(err);
    });
};

//DELETE /events/:id - Delete the event identified by id
exports.delete = (req, res, next) => {
  let id = req.params.id;
  model
    .findByIdAndDelete(id, { useFindAndModify: false })
    .then((event) => {
      rsvpModel.deleteMany({ event: id }).then(() => {
        req.flash("success", "Event and all its associated RSVPs have been deleted successfully");
        res.redirect("/events");
      });
    })
    .catch((err) => next(err));
};

// POST /events/:id/rsvp: creates/updates rsvp for an event identified by id
exports.updateRsvp = (req, res, next) => {
  // To avoid caching in the browser, we set these HTTP headers in order to display accurate error messages
  res.header("Cache-Control", "no-cache, private, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
  let eventId = req.params.id;
  let user = req.session.user;
  let status = req.body.status;
  console.log(eventId, user, status);
  rsvpModel.findOne({user: user, event: eventId})
  .then(rsvp => {
      if(rsvp){
          rsvp.status = req.body.status;
          rsvpModel.findByIdAndUpdate(rsvp.id, rsvp, {useFindAndModify: false, runValidators: true})
          .then(eventRsvp => {
              req.flash('success', 'Successfully updated your RVSP for the event');
              res.redirect("/users/profile");
          })
          .catch(err => console.log(err))
      } else {
          let newRsvp = new rsvpModel();
          newRsvp.status = req.body.status;
          newRsvp.user = user;
          newRsvp.event = eventId;
          newRsvp.save()
          .then(result => {
              req.flash('success', 'Successfully created an RVSP for the event');
              res.redirect("/users/profile");
          })
          .catch(err => next(err))
      }
  })
  .catch(err => next(err))
}