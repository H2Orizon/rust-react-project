import { useEffect, useState } from "react"
import { getCities, getCountries } from "../api/location"
import type { Country } from "../types/location"

export function useLocationForm( initialLocation?: string ){
    const [countries, setCountries] = useState<Country[]>([])
    const [cities, setCities] = useState<string[]>([])

    const [country, setCountry] = useState("")
    const [city, setCity] = useState("")

    useEffect(() => {
        getCountries().then(setCountries)
    }, [])

    useEffect(() => {

        if(!initialLocation) return

        const parts =
            initialLocation.split(", ")

        setCity(parts[0] || "")
        setCountry(parts[1] || "")

    }, [initialLocation])

    const selectCountry = async ( selectedCountry: string) => {
        setCountry(selectedCountry)

        if(selectedCountry){
            const data = await getCities(selectedCountry)

            setCities(data)
        }
    }

    const selectCity = ( selectedCity: string ) => {
        setCity(selectedCity)
    }

    const location =
        city
            ? `${city}, ${country}`
            : country

    return {
        countries,
        cities,

        country,
        city,

        location,

        selectCountry,
        selectCity
    }
}