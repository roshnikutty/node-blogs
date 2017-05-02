const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

chai.use(chaiHttp);

const { app, runServer, closeServer } = require('../server');

describe('Blogs', function () {

    before(function () {
        return runServer();
    });

    after(function () {
        return closeServer();
    });

    it('should list items on GET', function () {
        return chai.request(app)
            .get('/blogs')
            .then(function (res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.length.should.be.at.least(1);

                const expectedKeys = ['id', 'title', 'content', 'author'];

                res.body.forEach(function (item) {
                    item.should.be.a('object');
                    item.should.include.keys(expectedKeys);
                });
            });
    });

    it('should create item on POST', function () {
        const newItem = {
            title: "My Test Ramblings",
            content: "Testing POST operation",
            author: "Roshni",
            publishDate: "4/30/2017"
        };
        return chai.request(app)
            .post('/blogs')
            .send(newItem)
            .then(function (res) {
                res.should.have.status(201);
                res.should.be.json;
                res.should.be.a('object');
                res.body.should.include.keys('id', 'title', 'content', 'author');
                res.body.id.should.not.be.null;
                res.body.should.deep.equal(Object.assign(newItem, { id: res.body.id }));
            });
    });

    it('should update item on PUT', function () {
        const updateData = {
            title: "My Updated Test Ramblings",
            content: "Testing PUT operation",
            author: "Roshni"
        };
        chai.request(app)
            .get('/blogs')
            .then(function (res) {
                updateData.id = res.body[0].id;
                console.log(res.body[0].id);
                chai.request(app)
                    .put(`/blogs/${updateData.id}`)
                    .send(updateData)
                    .then(function (res) {
                        res.should.be.json;
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.deep.equal(updateData);
                    });
            })
    });

    it('should delete item on DELETE', function () {
        return chai.request(app)
            .get('/blogs')
            .then(function (res) {
                return chai.request(app)
                    .delete(`/blogs/${res.body[0].id}`);
            })
            .then(function (res) {
                res.should.have.status(204);
            });
    });
});