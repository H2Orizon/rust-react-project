import axios from "axios"

export const getCountries = async () => {

    const res = await axios.get(
        "https://restcountries.com/v3.1/all?fields=name,flag,cca2"
    )

    return res.data
}

export const getCities = async (
    country: string
) => {

    const res = await axios.post(
        "https://countriesnow.space/api/v0.1/countries/cities", 
        { country }, {timeout: 10000}
    )

    return res.data.data
}