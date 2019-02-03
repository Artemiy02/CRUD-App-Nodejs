const Event = require('../models/event');

module.exports = {
  showEvents: showEvents,
  showSingle: showSingle,
  seedEvents: seedEvents,
  showCreate: showCreate,
  processCreate: processCreate,
  showEdit: showEdit,
  processEdit: processEdit,
  deleteEvent: deleteEvent
};

/**
  *show all events
*/
 function showEvents(req, res){
   // get all events
   Event.find({}, (err, events) => {
     if (err) {
       res.status(404);
       res.send('Events not found!');
     }

     // return a view with data
     res.render('pages/events', {
       events: events,
       success: req.flash('success')
     });
   });
};

/**
 * show a single event
 */
function showSingle(req, res){
  // get a single event
  Event.findOne({ slug: req. params.slug }, (err, event) => {
    if (err)
      res.status(404).end('Events not found!');


    res.render('pages/single', {
      event: event,
      success: req.flash('success')
    });

  });
};




/**
 *  seed our database
 */
function seedEvents(req, res){
  // create some eventSchema
  const events = [
   { name: 'Basketball', description: 'Throwing into a basket.' },
   { name: 'Swimming', description: 'Michael Phelps is the fast fish.' },
   { name: 'Weightlifting', description: 'Lifting heavy things up' },
   { name: 'Pind Pong', description: 'Super fast paddles'}
  ];

  // use the Event model to insert/save
  Event.deleteMany({}, () => {
    for (event of events) {
      var newEvent = new Event(event);
      newEvent.save();
    }
  });

  //seeded!
  res.send('Database seeded!');
};

/**
 * Show the create form
 */
function showCreate(req, res) {
  res.render('pages/create', {
    errors: req.flash('errors')
  });
}

/**
  * Process the creation form
*/
function processCreate(req, res) {
  // validate information
  req.checkBody('name', 'Name is required.').notEmpty();
  req.checkBody('description', 'Description is required').notEmpty();

  // if there are errors, redirect and save errors to flash
  const errors = req.validationErrors();
  if (errors) {
    req.flash('errors', errors.map(err => err.msg));
    return res.redirect('/events/create');
  }

  // create a new event
  const event = new Event({
    name: req.body.name,
    description: req.body.description
  });

  // save event
  event.save((err) => {
    if (err)
      throw err;

      // set a successful flash message
      req.flash('success', 'Successfuly created event!');

    // redirect to the newly created event
    res.redirect(`/events/${event.slug}`);
  });
}

/**
 * Show the edit
 */
function showEdit(req, res) {
  Event.findOne({ slug: req.params.slug }, (err, event) => {
    res.render('pages/edit', {
      event: event,
      errors: req.flash('errors')
    });
  });

}

 /**
  * process Edit
  */
function processEdit(req, res) {
  // validate information
  req.checkBody('name', 'Name is required.').notEmpty();
  req.checkBody('description', 'Description is required').notEmpty();

  // if there are errors, redirect and save errors to flash
  const errors = req.validationErrors();
  if (errors) {
    req.flash('errors', errors.map(err => err.msg));
    return res.redirect(`/events/${req.params.slug}/edit`);
  }

  //find a current event
  Event.findOne({ slug: req.params.slug }, (err, event) => {
    //updating that event
    event.name = req.body.name;
    event.description = req.body.description;

    event.save((err) => {
      if (err)
        throw err;

      //success flash message
      req.flash('success', 'Successfully updated event.');
      // redirect back to the /events
      res.redirect('/events');
    });
  });
}

/**
 *  delete event
 */
function deleteEvent(req, res) {
  Event.remove({ slug: req.params.slug }, (err) => {
    //set flash database
    // redirect back to the events page
    req.flash('success', 'Event deleted!');
    res.redirect('/events');
  });
}
