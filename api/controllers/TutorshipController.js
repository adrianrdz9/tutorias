/**
 * TutorshipController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  


  index: async function (req, res) {
    var tutorships = await Tutorship.find()
        .populate('subject')
        .populate('owner')
        .populate('users')
    
    //Remove sensitive data before sending it to the view
    for (let i = 0; i < tutorships.length; i++) {
      var tutorship = tutorships[i];
      tutorship.owner = _.pick(tutorship.owner, ['name']);
      tutorship.is_available = await Tutorship.is_available(tutorship);
      tutorship.available = tutorship.max - tutorship.users.length;
      tutorships[i] = tutorship;
    }

    for (let i in tutorships) {
      var tutorship = tutorships[i];
      var users = tutorship.users;
      for(let j in users){
        user = users[j];
        user = _.pick(user, ['name']);
        users[j] = user;
      }

      tutorships[i].users = users;
    }

    return res.view('tutorships/index', {
      tutorships
    });
  },

  create: async function(req, res){
    if(req.session.user.is_tutor === true){
      return res.view('tutorships/new', {subjects: await Subject.find()});
    }else{
      return res.redirectF('/tutorships', {error: ['Debes de ser tutor']});
    }
  },

  store: async function(req, res){
    //Only the tutors can create new tutorships
    if(req.session.user.is_tutor === true){
      try {
        await Tutorship.create({
          subject: req.body.subject,
          max: req.body.max,
          owner: req.session.userId
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

  show: async function(req, res){
    var tutorship = await Tutorship.find({id: req.params.id}).limit(1)
        .populate('subject')
        .populate('owner')
        .populate('users')
    tutorship = tutorship[0];
    //Remove sensitive data before sending it to the view
    tutorship.owner = _.pick(tutorship.owner, ['name']);

    tutorship.is_available = await Tutorship.is_available(tutorship);  
    tutorship.available = tutorship.max - tutorship.users.length;


    var users = tutorship.users;
    for(let j in users){
      user = users[j];
      user = _.pick(user, ['name']);
      users[j] = user;
    }
    const tutorshipRequested = await TutorshipRequest.findOne({
      requestor: req.session.userId,
      tutorshipRequested: tutorship.id
    });

    var requestStatus = null;
    if(tutorshipRequested){
      requestStatus = tutorshipRequested.status
    }

    return res.view('tutorships/show', {
      tutorship,
      requestStatus: requestStatus
    });
  },

  request: async function(req, res){
    try{
      const tutorshipRequested = await Tutorship.findOne({id: req.params.id});
      if(!tutorshipRequested) {
        res.staus(400);
        res.json({error: "No existe esa tutoría"});
      }

      if(await TutorshipRequest.findOne({
        requestor: req.session.userId,
        tutorshipRequested: tutorshipRequested.id
      })){
        res.staus(429);
        res.json({error: "Ya solicitaste esta tutoría"})
      }



      if(await Tutorship.is_available(tutorshipRequested)){
        await TutorshipRequest.create({
          requestor: req.session.userId,
          tutorshipRequested: tutorshipRequested.id
        });
        res.ok();
      }else{
        res.staus(400);
        res.json({error: "Ya no hay cupo para esta tutoria"});
      }
    }catch(err){
      res.staus(400);
      res.json(err);
    }

    
  },

  manage: async function(req, res){
    if(!req.session.user.is_tutor){
      res.redirectF("/tutorships", {error: ["No eres tutor"]})
    }

    var tutorships = await Tutorship.find({owner: req.session.userId})
        .populate('subject')
        .populate('users')
    
    //Remove sensitive data before sending it to the view
    for (let i = 0; i < tutorships.length; i++) {
      var tutorship = tutorships[i];

      tutorship.is_available = await Tutorship.is_available(tutorship);

      tutorship.available = tutorship.max - tutorship.users.length;

      tutorship.requests = await TutorshipRequest.find({
        tutorshipRequested: tutorship.id,
        status: 0
      }).populate('requestor');

      for (j in tutorship.requests) {
        tutorship.requests[j].requestor = _.pick(tutorship.requests[j].requestor, ['name'])
      }

      tutorships[i] = tutorship;
    }

    for (let i in tutorships) {
      var tutorship = tutorships[i];
      var users = tutorship.users;
      for(let j in users){
        user = users[j];
        user = _.pick(user, ['name']);
        users[j] = user;
      }

      tutorships[i].users = users;
    }

    return res.view('tutorships/manage', {
      tutorships
    });
  },

  respondRequest: async function(req, res){
    var request = await TutorshipRequest.find({id: req.params.id}).limit(1).populate('tutorshipRequested');
    if(!request) {
      res.status(400);
      return res.json({error: "No existe esta solicitud"});
    }
    request = request[0];

    if(await Tutorship.is_available({id: request.tutorshipRequested.id})){
      await Tutorship.addToCollection(request.tutorshipRequested.id, 'users', request.requestor);
      var newStatus;
      if(req.body.action === "accept"){
        newStatus = 1;
      }else if(req.body.action === "reject"){
        newStatus = 2;
      }

      await TutorshipRequest.update({id: request.tutorshipRequested.id}, {status: newStatus});

      return res.ok();
    }else{
      return res.json({error: "Ya no hay cupo"});
    }
  }

};

