/**
 * TutorshipController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  

  // GET /tutorships
  index: async function (req, res) {
    // Populate all data related to all tutorships
    var tutorships = await Tutorship.find()
        .populate('subject')
        .populate('owner')
        .populate('horaries')
    
    //
    // ─── REMOVE SENSITIVE DATA BEFORE SENDING IT TO THE VIEW ─────────
    //  
    for (let i = 0; i < tutorships.length; i++) {
      var tutorship = tutorships[i];
      tutorship.owner = _.pick(tutorship.owner, ['name']);

      tutorship.is_available = await Tutorship.has_any_available(tutorship);

      tutorship.available = await Tutorship.available_horaries(tutorship);
      tutorship.available = tutorship.available.length;

      tutorships[i] = tutorship;
    }
    // ─────────────────────────────────────────────────────────────────

    return res.view('tutorships/index', {
      tutorships
    });
  },

  // GET /tutorships/new
  create: async function(req, res){
    // Validate that user is a tutor
    if(req.session.user.is_tutor === true){
      return res.view('tutorships/new', {subjects: await Subject.find()});
    }else{
      return res.redirectF('/tutorships', {error: ['Debes de ser tutor']});
    }
  },

  // POST /tutorships
  store: async function(req, res){
    //Only the tutors can create new tutorships
    if(req.session.user.is_tutor === true){
      try {
        var newTutorship = await Tutorship.create({
          subject: req.body.subject,
          owner: req.session.userId
        }).fetch();
        // Assign one or more horaries to the tutorship
        req.body.horary.forEach(async (hor) => {
          let horary = await Horary.create({
            max: hor.max,
            date: hor.date,
            time: hor.time,
            place: hor.place
          }).fetch();

          await Tutorship.addToCollection(newTutorship.id, 'horaries', [horary.id]);
        });


        return res.redirectF('/tutorships', {success: ["Tutoria creada"]})
      } catch (error) {
        sails.log(error);
        return res.redirectF('/tutorships/new', {error: [JSON.stringify(error)]});
      }
    }else{
      return res.redirectF('/tutorships', {error: ['Debes de ser tutor']});
    }
  }, 

  // GET /tutorships/:id
  show: async function(req, res){
    // Populate all data related to a specific tutorship
    var tutorship = await Tutorship.find({id: req.params.id}).limit(1)
        .populate('subject')
        .populate('owner')
        .populate('horaries')
    tutorship = tutorship[0];

    //
    // ─── DISPLAY HOW MANY PLACES ARE LEFT FOR EACH HORARY ────────────
    //
    for(i in tutorship.horaries){
      tutorship.horaries[i].available = await Horary.available(tutorship.horaries[i]);
      tutorship.horaries[i].status = await TutorshipRequest.findOne({
        requestor: req.session.userId,
        horary: tutorship.horaries[i].id
      })
      if(tutorship.horaries[i].status){
        tutorship.horaries[i].status = tutorship.horaries[i].status.status;
      }else{
        tutorship.horaries[i].status = null;
      }
    }

    //
    // ─── REMOVE SENSITIVE DATA BEFORE SENDING IT TO THE VIEW ─────────
    //  
    tutorship.owner = _.pick(tutorship.owner, ['name']);

    tutorship.is_available = await Tutorship.has_any_available(tutorship);  
    tutorship.available = await Tutorship.available_horaries(tutorship);
    tutorship.available = tutorship.available.length;


    var users = tutorship.users;
    for(let j in users){
      user = users[j];
      user = _.pick(user, ['name']);
      users[j] = user;
    }
    // ─────────────────────────────────────────────────────────────────

    return res.view('tutorships/show', {
      tutorship,
    });
  },

  // POST /tutorships/:id/request
  request: async function(req, res){
    try{
      //
      // ─── VALIDATE ────────────────────────────────────────────────────
      //
      const horaryRequested = await Horary.findOne({id: req.params.id});
      if(!horaryRequested) {
        res.status(400);
        res.json({error: "No existe ese horario"});
      }

      if(await TutorshipRequest.findOne({
        requestor: req.session.userId,
        horary: horaryRequested.id
      })){
        res.status(429);
        res.json({error: "Ya solicitaste esta tutoría"})
      }
      //
      // ─── VALIDAR DISPONIBILIDAD Y REALIZAR LA SOLICITUD ──────────────
      //     
      if(await Horary.is_available(horaryRequested)){
        await TutorshipRequest.create({
          requestor: req.session.userId,
          horary: horaryRequested.id
        });
        res.ok();
      }else{
        res.status(400);
        res.json({error: "Ya no hay cupo para esta tutoria"});
      }
      // ─────────────────────────────────────────────────────────────────
    }catch(err){
      res.status(500);
      res.json(err);
    }
  },

  // GET /tutorships/manage
  manage: async function(req, res){
    // Only tutor can manage their tutorships
    if(!req.session.user.is_tutor){
      res.redirectF("/tutorships", {error: ["No eres tutor"]})
    }

    // Get current user tutorships
    var tutorships = await Tutorship.find({owner: req.session.userId})
        .populate('subject')
    
    //
    // ─── GET ALL DATA RELATED TO THE USER'S TUTORSHIPS (REQUESTS, AVAILABILITY, ETC.) 
    //
    for (let i = 0; i < tutorships.length; i++) {
      var tutorship = tutorships[i];

      tutorship.is_available = await Tutorship.has_any_available(tutorship);

      tutorship.available = await Tutorship.available_horaries(tutorship);
      tutorship.available = tutorship.available.length

      tutorship.horaries = await Horary.find({tutorship: tutorship.id}).populate("users");

      for (j in tutorship.horaries) {
        tutorship.horaries[j].requests = await TutorshipRequest.find({
          horary: tutorship.horaries[j].id
        }).populate("requestor"); 
        tutorship.horaries[j].available = await Horary.available(tutorship.horaries[j]);
      }

      tutorships[i] = tutorship;
    }
    // ─────────────────────────────────────────────────────────────────
    return res.view('tutorships/manage', {
      tutorships
    });
  },

  // POST /tutorships/request/:id
  respondRequest: async function(req, res){
    // Get current request
    var request = await TutorshipRequest.find({id: req.params.id}).limit(1).populate('horary');
    // Validate request existance
    if(!request) {
      res.status(400);
      return res.json({error: "No existe esta solicitud"});
    }
    request = request[0];

    //
    // ─── VALIDATE HORARY AVAILABILITY BEFORE ACCEPTING THE REQUEST ───
    //
    var newStatus;
    if(req.body.action === "reject"){
      newStatus = 2;
    }

    if(await Horary.is_available({id: request.horary.id}) || req.body.action === "reject"){


      if(req.body.action === "accept"){
        await Horary.addToCollection(request.horary.id, 'users', request.requestor);
        newStatus = 1;
      } 

      //
      // ─── ADD USER TO THE HORARY ──────────────────────────────────────
      //
      var requestor = await TutorshipRequest.update({id: request.id}, {status: newStatus}).fetch();
      requestor = requestor[0];

      var owner = await Horary.find({id: requestor.horary}).limit(1).populate("tutorship");

      var linkTo = "/tutorships/"+owner[0].tutorship.id;
      owner = owner[0].tutorship.owner;

      owner = await User.find({id: owner}).limit(1);
      owner = owner[0].name;

      requestor = requestor.requestor;

      //
      // ─── BUILD AND SEND NOTIFICATION TO THE USER ─────────────────────
      //
      var message = "" + owner + " te ha " + (newStatus === 1 ? "aceptado" : "rechazado") + " en una de sus tutorias";


      await Notification.create({
        title: message,
        user: requestor,
        linkTo: linkTo
      })

      // ─────────────────────────────────────────────────────────────────
      return res.ok();
    }else{
      return res.json({error: "Ya no hay cupo"});
    }
    // ─────────────────────────────────────────────────────────────────
   

  }

};

