const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const ROLES_LIST = require('../config/rolesList');
const ProductController = require('../controllers/product');
const app = 'https://boatsboatsboats-aovb.onrender.com';
const { expect } = chai;

chai.use(chaiHttp);

const responseTimesMap = new Map();
const numIterations = 1;


const user = {
  username: 'Adminkoolguy420@gmail.com',
  roles: [ROLES_LIST.Admin, ROLES_LIST.User],
};


describe('Testing Product Endpoints', function () {
  this.timeout(0);

  //GET

  it('should test the API', async function () {

    const productId = '65063375533acb75f17a5e96';

    const token = jwt.sign({ UserInfo: user }, process.env.ACCESS_TOKEN_SECRET);

    const responseTimes = [];

    for (let i = 0; i < numIterations; i++) {
      const startTime = Date.now();

      const res = await chai
        .request(app)
        .get(`/product/${productId}`)
        .set('Authorization', `Bearer ${token}`);

      const endTime = Date.now();

      const responseTime = endTime - startTime;
      responseTimes.push(responseTime);

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
    }

    const totalResponseTime = responseTimes.reduce((acc, time) => acc + time, 0);
    const averageResponseTime = totalResponseTime / numIterations;

    responseTimesMap.set('GET_PRODUCT', averageResponseTime);
    console.log(`Average Response Time: ${averageResponseTime} ms`);

  });


  // POST

  it('should test the API for inserting products', async function () {
    const productData = {
      name: 'NOT_A_PRODUCT',
      description: 'A sample product description',
      price: 19.99,
    };

    const token = jwt.sign({ UserInfo: user }, process.env.ACCESS_TOKEN_SECRET);

    const responseTimes = [];

    for (let i = 0; i < numIterations; i++) {
      const startTime = Date.now();

      const res = await chai
        .request(app)
        .post('/product/insert')
        .set('Authorization', `Bearer ${token}`)
        .send(productData);

      const endTime = Date.now();

      const responseTime = endTime - startTime;
      responseTimes.push(responseTime);

      expect(res).to.have.status(200);
    }

    const totalResponseTime = responseTimes.reduce((acc, time) => acc + time, 0);
    const averageResponseTime = totalResponseTime / numIterations;

    responseTimesMap.set('POST_PRODUCT', averageResponseTime);
    console.log(`Average Response Time for Post: ${averageResponseTime} ms`);

  });

  it('should test the API for deleting a product', async function () {
    // Replace 'productIdToDelete' with the actual product ID you want to delete
    const controller = new ProductController(process.env.DB_URI, 'products');
    const productIdToDelete = await controller.getProductIdByName('NOT_A_PRODUCT')
    const token = jwt.sign({ UserInfo: user }, process.env.ACCESS_TOKEN_SECRET);
  
    const responseTimes = [];
  
    for (let i = 0; i < numIterations; i++) {
      const startTime = Date.now();
  
      const res = await chai
        .request(app)
        .delete(`/product/${productIdToDelete}`)
        .set('Authorization', `Bearer ${token}`);
  
      const endTime = Date.now();
  
      const responseTime = endTime - startTime;
      responseTimes.push(responseTime);
  
      expect(res).to.have.status(200);
    }
  
    // Calculate the average response time
    const totalResponseTime = responseTimes.reduce((acc, time) => acc + time, 0);
    const averageResponseTime = totalResponseTime / numIterations;
  
    responseTimesMap.set('DELETE_PRODUCT', averageResponseTime);
    console.log(`Average Response Time for Delete: ${averageResponseTime} ms`);
  });


});


