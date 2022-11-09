var express = require("express"); //requiring express module
var app = express(); //creating express instance
var querystring = require('querystring');
const axios = require('axios');
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')
const PORT = process.env.PORT || 5000

app.use(express.json())

const auth_url = 'https://keycloak-edu-keycloak.apps.openshift-01.knowis.cloud/auth/realms/education/protocol/openid-connect/token';
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

async function getJWTToken(){
    var data = querystring.stringify({
        grant_type: "client_credentials",
        client_id: "watson-orchestrate",
        client_secret:"ca81109d-312d-4ed3-9cf0-19398e26ea9d"
    
    });
    try {
        const jwt_token= await axios.post(auth_url,data,{
              headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Content-Length': Buffer.byteLength(data)
            }
        }
        );
      return jwt_token.data.access_token;
        } catch (error) {
            console.log(error);
        }
}


app.get('/getByJR',async (req,res) => {
    try {
        var jwt_token = await getJWTToken()
    const axiosInstance = axios.create({
        headers: { 
            'Authorization': 'Bearer '+jwt_token
        }
    });
    const response = await axiosInstance.get('https://education-dev.apps.openshift-01.knowis.cloud/getcandidatesbyjr/api/hello/getByJR',{
        params: {
            jobReqId: req.query.jobReqId
        }
      });
    res.send(response.data)
    } catch (error) {
        res.status(error.response.status).send(error.response.data)
    }
})

app.listen(PORT, function() {
 console.log("Node server is running..");
});



