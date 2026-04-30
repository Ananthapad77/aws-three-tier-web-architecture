const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/userController');

// Stats must come BEFORE /:id so it doesn't get swallowed as an ID
router.get('/stats', ctrl.getStats);

router.get('/',       ctrl.getAll);    // GET    /api/users?search=&role=&status=&page=&limit=
router.get('/:id',    ctrl.getById);   // GET    /api/users/:id
router.post('/',      ctrl.create);    // POST   /api/users
router.put('/:id',    ctrl.update);    // PUT    /api/users/:id
router.delete('/:id', ctrl.remove);    // DELETE /api/users/:id

module.exports = router;
