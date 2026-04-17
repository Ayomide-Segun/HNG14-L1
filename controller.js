const Profile = require("./model");
const axios = require("axios");
const {v7 :uuidv7} = require('uuid');

exports.addProfile = async(req, res) => {
    const { name } = req.body;
    
    try {
        let profile;
        
        if(typeof name !== "string"){
            return res.status(422).json({
                status: "error",
                message: "Unprocessable Entity"
            })
        };
        if(!name || name.trim() === ""){
            return res.status(400).json({
                status: "error",
                message: "Bad request"
            })
        };

        const normalizedName = name.trim().toLowerCase();
        const nameExists = await Profile.findOne({ name: normalizedName });
        if(nameExists){
            const {_id, __v, ...cleanProfile} = nameExists.toObject();
            return res.status(200).json({
                status: "success",
                message: "Profile already exists",
                data: cleanProfile
            })
        }

        const [genderizeResponse,  agifyResponse, nationalizeResponse] =
        await Promise.all([
            axios.get(`https://api.genderize.io?name=${normalizedName}`, { timeout: 5000 }),
            axios.get(`https://api.agify.io?name=${normalizedName}`, { timeout: 5000 }),
            axios.get(`https://api.nationalize.io?name=${normalizedName}`, { timeout: 5000 })
        ]);
        

        const {gender, probability, count} = genderizeResponse.data;
        if(gender === null || count === 0){
            return res.status(502).json({
                status: "error",
                message: "Genderize returned an invalid response"
            })
        }
        const gender_probability = probability;
        const sample_size = count;

        const {age} = agifyResponse.data;
        if(age === null){
            return res.status(502).json({
                status: "error",
                message: "Agify returned an invalid response"
            })
        }       
        
        let age_group;
        if(age >= 0 && age <= 12){
            age_group = "child";
        } else if(age >= 13 && age <= 19){
            age_group = "teenager"
        } else if(age >= 20 && age <= 59){
            age_group = "adult"
        } else{
            age_group = "senior"
        }


        const countries = nationalizeResponse.data.country;
        if(!countries || countries.length === 0){
            return res.status(502).json({
                status: "error",
                message: "nationalize returned an invalid response"
            })
        }

        const topCountry = countries.reduce((max, curr) =>
            curr.probability > max.probability ? curr : max
        );
        const {country_id} = topCountry;
        const country_probability = topCountry.probability;

        
        profile = await Profile.create({
            name: normalizedName,
            id: uuidv7(),
            gender,
            gender_probability,
            sample_size,
            age,
            age_group,
            country_id,
            country_probability,
            created_at: new Date().toISOString()
        })

        const {_id, __v, ...cleanProfile} = profile.toObject();
        
        res.status(201).json({
            status: "success",
            data: cleanProfile
        })

    } catch (error) {
        console.error(error.message);

        res.status(500).json({
            status: "error",
            message: error.message || "Internal server error"
        })
    }
}


exports.getProfileUsingParams = async(req, res) => {
    const {id} = req.params;
    try {
        const profile = await Profile.findOne({id});
        if (!profile) {
            return res.status(404).json({
                status: "error",
                message: "Profile not found"
            });
        }
        const {_id, __v, ...cleanProfile} = profile.toObject();
        res.status(200).json({
            status: "success",
            data: cleanProfile
        })
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message || "Unable to retrieve profile"
        })
    }
}

exports.getProfileUsingQuery = async(req, res) => {
    let { gender, country_id, age_group } = req.query;

    try {
        let filteredProfiles = await Profile.find();

        // Apply filters if they exist
        if (gender) {
            filteredProfiles = filteredProfiles.filter(
            p => p.gender.toLowerCase() === gender.toLowerCase()
            );
        }
        if (country_id) {
            filteredProfiles = filteredProfiles.filter(
            p => p.country_id.toLowerCase() === country_id.toLowerCase()
            );
        }
        if (age_group) {
            filteredProfiles = filteredProfiles.filter(
            p => p.age_group.toLowerCase() === age_group.toLowerCase()
            );
        }

        res.status(200).json({
            status: "success",
            count: filteredProfiles.length,
            data: filteredProfiles.map(p => ({
                id: p.id,
                name: p.name,
                gender: p.gender,
                age: p.age,
                age_group: p.age_group,
                country_id: p.country_id
            }))
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message || "Unable to retrieve profile"
        })
    }
}

exports.deleteProfiles = async(req, res) => {
    const {id} = req.params;
    try {
        const profile = await Profile.findOneAndDelete({id});
        if (!deleted) {
            return res.status(404).json({
                status: "error",
                message: "Profile not found"
            });
        }

        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Internal server error"
        });
    }
}