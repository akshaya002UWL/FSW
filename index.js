var express = require("express"); //requiring express module
var app = express(); //creating express instance
var querystring = require('querystring');
const axios = require('axios');
const PORT = process.env.PORT || 5000
var cors = require('cors')
app.use(cors())

app.use(express.json())

const auth_url = 'https://keycloak-edu-keycloak.apps.openshift-01.knowis.cloud/auth/realms/education/protocol/openid-connect/token';

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
            jobReqId: req.query.jobReqId,
            skills:req.query.skills,
            experience:req.query.experience
        }
      });
        var api_response = {
            "instances":response.data
        }
    res.send(api_response)
    } catch (error) {
        res.status(error.response.status).send(error.response.data)
    }
})

app.post('/filterProfiles',async (req,res) => {
    var data = req.body;
    var key = Object.keys(data);
    var candidate;
    if(key.length){
        key = key[0];
        candidate =data[key];
    } else {
        candidate = []
    }
    console.log(candidate)
    try {
        var jwt_token = await getJWTToken()
    const axiosInstance = axios.create({
        headers: { 
            'Authorization': 'Bearer '+jwt_token
        }
    });


    const response = await axiosInstance.post('https://education-dev.apps.openshift-01.knowis.cloud/getcandidatesbyjr/api/hello/filterProfiles',candidate,{
        params: {
            organization: req.query.organization,
            skills:req.query.location
        },
       
      });
         var api_response = {
            "instances":response.data
        }
    res.send(api_response)
    } catch (error) {
        console.log(error.response.data);
        res.status(error.response.status).send(error.response.data)
    }
})
app.post('/filterAppliedCandidates',async (req,res) => {
   // var data = req.body.candidates
    try {
        var jwt_token = await getJWTToken()
    const axiosInstance = axios.create({
        headers: { 
            'Authorization': 'Bearer '+jwt_token
        }
    });


    const response = await axiosInstance.post('https://education-dev.apps.openshift-01.knowis.cloud/filterprofile/api/hello/activecandidates/filterprofile',{},{
        params: {
           jobReqId: req.query.jobReqId
        },
       
      });
         var api_response = {
            "instances":response.data
        }
    res.send(api_response)
    } catch (error) {
        console.log(error.response.data);
        res.status(error.response.status).send(error.response.data)
    }
})

app.post('/getJRIdS',async (req,res) => {
    try {
            var data = req.body;
        console.log(req.body)
            var key = Object.keys(data);
            var jr=[];
            if(key.length){
                key = key[0];
                jr = {
                    "jobRequisitions":data[key]
                }
            } else {
                jr = {}
            }
             var jwt_token = await getJWTToken()
             
            const axiosInstance = axios.create({
                headers: { 
                    'Authorization': 'Bearer '+jwt_token
                }
            });


    const response = await axiosInstance.post('https://education-dev.apps.openshift-01.knowis.cloud/getjbr/api/gtjbre/getJRIdS',jr);
        console.log(response.data)
        var api_response = {
        "jobReqId":response.data.jrIdString
    }  
    res.send(api_response)
    } catch (error) {
        res.status(error.response.status).send(error.response.data)
    }
})

app.listen(PORT, function() {
 console.log("Node server is running..");
});



