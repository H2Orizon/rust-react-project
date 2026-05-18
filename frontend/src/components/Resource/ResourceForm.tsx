import type { CategoryDto } from "@shared/types/category"
import type { Country } from "@shared/types/location"
import { PaymentFor, type CreateResourceDto } from "@shared/types/resource"
import React from "react"

type Props = {
    form: CreateResourceDto
    setForm: React.Dispatch<React.SetStateAction<CreateResourceDto>>

    categories: CategoryDto[]

    countries: Country[]
    cities: string[]

    country: string
    city: string

    selectCountry: (
        country: string
    ) => Promise<void>

    selectCity: (
        city: string
    ) => void

    handleChange: (
        e: React.ChangeEvent<
            HTMLInputElement |
            HTMLSelectElement |
            HTMLTextAreaElement
        >
    ) => void
}

export default function ResourceFormFields({
    form,
    categories,

    countries,
    cities,

    country,
    city,

    selectCountry,
    selectCity,

    handleChange
}: Props){

    const countryHandle = async (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        await selectCountry(e.target.value)
    }

    const cityHandle = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        selectCity(e.target.value)
    }

    return (
        <>
            <input
                name="name"
                placeholder="Resource name"
                value={form.name}
                onChange={handleChange}
            />

            <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
            />

            <input
                type="number"
                name="price"
                placeholder="Price"
                value={form.price}
                onChange={handleChange}
            />

            <input
                type="number"
                name="capacity"
                placeholder="Capacity"
                value={form.capacity}
                onChange={handleChange}
            />

            <select
                value={country}
                onChange={countryHandle}
            >
                <option value="">Select country</option>

                {countries.map(c => (
                    <option
                        key={c.cca2}
                        value={c.name.common}
                    >
                        {c.flag} {c.name.common}
                    </option>
                ))}
            </select>

            {country && (
                <>
                    <select
                        value={city}
                        onChange={cityHandle}
                    >
                        <option value="">
                            Select city
                        </option>

                        {cities.map(c => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>

                    <span>{form.location}</span>
                </>
            )}

            <select
                name="category_id"
                value={form.category_id}
                onChange={handleChange}
            >
                {categories.map(c => (
                    <option
                        key={c.id}
                        value={c.id}
                    >
                        {c.name}
                    </option>
                ))}
            </select>

            <select
                name="payment_for"
                value={form.payment_for}
                onChange={handleChange}
            >
                {Object.values(PaymentFor).map(p => (
                    <option key={p} value={p}>
                        {p}
                    </option>
                ))}
            </select>

            <label>
                Auto approve?

                <input
                    type="checkbox"
                    name="auto_approved"
                    checked={form.auto_approved}
                    onChange={handleChange}
                />
            </label>
        </>
    )
}