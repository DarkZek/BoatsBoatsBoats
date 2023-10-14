const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const app = 'https://boatsboatsboats-aovb.onrender.com'; 
const { expect } = chai;

chai.use(chaiHttp);

describe('Product Endpoint Tests', function () {
  it('should return data with a valid JWT token and correct role', async function () {
    this.timeout(10000)
    
    // Define a user with the necessary role
    const user = {
      username: 'Userkoolguy420@gmail.com',
      roles: [7777],
    };

    // Create a JWT token for the user
    const token = jwt.sign({ UserInfo: user }, process.env.ACCESS_TOKEN_SECRET);

    // A valid product ID 
    const productId = '65063375533acb75f17a5e96';

    const res = await chai
      .request(app)
      .get(`/product/${productId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
    // Check additional params? 
  });
});

