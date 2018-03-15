const expect = require('expect');
const supertest = require('supertest');
const { ObjectId } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');
const { todos, populateTodos, users, populateUsers } = require('./seed/seed');
const { User } = require('./../models/user');


beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'Test todo text';

        supertest(app)
            .post('/todos')
            .send({ text })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.find({ text }).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((err) => {
                    done(err);
                })
            })

    });


    it('should not create a new todo', (done) => {
        supertest(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((err) => {
                    done(err);
                })
            })

    });
})




describe('GET /todos', () => {
    it('should get all the todos', (done) => {
        supertest(app)
            .get('/todos')
            .expect(200)
            .end((err, res) => {
                expect(res.body.todos.length).toBe(2);
                done()
            })
    })

})




describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        supertest(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done)
    });

    it('should return a 404 status code', (done) => {
        supertest(app)
            .get(`/todos/${new ObjectId().toHexString()}`)
            .expect(404)
            .end(done)
    });

    it('should return a 404  and invalid id', (done) => {
        supertest(app)
            .get('/todos/1234')
            .expect(404)
            .expect((res) => {
                expect(res.body.message).toBe('invlid Id');
            })
            .end(done)
    });
});




describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        supertest(app)
            .delete(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(todos[0]._id.toHexString())
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.findById(todos[0]._id.toHexString()).then((todo) => {
                    expect(todo).toBe(null);
                    done();
                }).catch((e) => {
                    done(e)
                })
            })
    });

    it('should return 404 if todo not found', (done) => {
        supertest(app)
            .delete(`/todos/${new ObjectId().toHexString()}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 if object id is invalid', (done) => {
        supertest(app)
            .delete(`/todos/12345`)
            .expect(404)
            .end(done);
    });


})





describe('PATCH /todos/:id', () => {
    it('should update todo', (done) => {
        var textToUpdate = 'testing the todo update';
        supertest(app).
            patch(`/todos/${todos[0]._id.toHexString()}`)
            .send({ completed: true, text: textToUpdate })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(textToUpdate);
                expect(res.body.todo.completed).toBe(true);
                expect(typeof res.body.todo.completedAt).toBe('number');
            }).end(done);
    });



    it('should clear completedAt when todo is not completed', (done) => {
        supertest(app)
            .patch(`/todos/${todos[1]._id.toHexString()}`)
            .send({ completed: false })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.completed).toBe(false)
                expect(res.body.todo.completedAt).toBe(null)
            }).end(done);
    })


})





describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        supertest(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            }).end(done)

    });



    it('should return 401 if not authenticated', (done) => {
        supertest(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({ error: true, message: 'Invalid token' });
            }).end(done);
    })
})



describe('POST /users', () => {
    it('should create user', (done) => {
        var email = 'example@example.com';
        var password = '123mnb!';

        supertest(app)
            .post('/users')
            .send({ email, password })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy();
                expect(res.body.email).toBe(email);
                expect(res.body._id).toBeTruthy();
            }).end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.findOne({ email }).then((user) => {
                    expect(user).toBeTruthy();
                    expect(user.password).not.toBe(password);
                    done();
                })
            })

    });


    it('should return validation error if request is invalid', (done) => {
        var email = 'example2@example.com';
        var password = '123'; //Length fails

        supertest(app)
            .post('/users')
            .send({ email, password })
            .expect(400)
            .end(done);

    });


    it('should not create user if email is already present', (done) => {
        var email = 'example@example.com'; //email already present
        var password = '123mnb1';

        supertest(app)
            .post('/users')
            .send({ email, password })
            .expect(200)
            .expect((res) => {
                expect(res.body.email).toBe(email);
            })
            .end(done);
    })
})




describe('POST /users/login', () => {
    it('should login user and return auth token', (done) => {
      supertest(app)
        .post('/users/login')
        .send({
          email: users[0].email,
          password: users[0].password
        })
        .expect(200)
        .expect((res) => {
          expect(res.headers['x-auth']).toBeTruthy();
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
  
          User.findById(users[0]._id).then((user) => {
            expect(user.tokens[0]['access']).toBe('auth');
            expect(user.tokens[0].token).toBe(res.headers['x-auth']);
            done();
          }).catch((e) => done(e));
        });
    });
  
    it('should reject invalid login', (done) => {
        supertest(app)
        .post('/users/login')
        .send({
          email: users[1].email,
          password: users[1].password + '1'
        })
        .expect(400)
        .expect((res) => {
          expect(res.headers['x-auth']).toBe(undefined);
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
  
          User.findById(users[1]._id).then((user) => {
            expect(user.tokens.length).toBe(0);
            done();
          }).catch((e) => done(e));
        });
    });
  });