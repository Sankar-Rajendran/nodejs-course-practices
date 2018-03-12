const expect = require('expect');
const supertest = require('supertest');
const { ObjectId } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');


const todos = [{
    _id: new ObjectId(),
    text: 'First test todo'
}, {
    _id: new ObjectId(),
    text: 'Second test todo',
    completed: true,
    complatedAt: 333
}];


beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => { done() });
})

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
