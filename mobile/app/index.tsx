import { getCategories } from "@/api/categories"
import { getResources } from "@/api/resources"
import { useEffect, useState } from "react"
import { ScrollView, Text, View, TextInput, Pressable } from "react-native"
import { CategoryDto } from "@shared/types/category"
import { PaginatedResponseResource, ResourceQuery } from "@shared/types/resource"
import ResourceCard from "./resources/ResourceCard"
import { styles } from "app/styles/home-style"

export default function Home() {

    const [categories, setCategories] =
        useState<CategoryDto[]>([])

    const [data, setData] =
        useState<PaginatedResponseResource>()

    const [query, setQuery] =
        useState<ResourceQuery>({
            resource_name: undefined,
            category: undefined,
            min_price: undefined,
            max_price: undefined,
            per_page: 10,
            page: 1
        })

    const resources = data?.resources || []

    const totalPages = data?.total_pages || 1

    useEffect(() => {

        const timeout = setTimeout(() => {

            getResources(query)
                .then(setData)

        }, 300)

        return () => clearTimeout(timeout)

    }, [query])

    useEffect(() => {
        getCategories()
            .then(setCategories)
    }, [])

    return (

        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
        >

            {/* SEARCH */}

            <View style={styles.searchContainer}>

                <TextInput
                    placeholder="Search resource..."
                    placeholderTextColor="#9ca3af"
                    value={query.resource_name || ""}
                    onChangeText={(text) =>
                        setQuery(prev => ({
                            ...prev,
                            resource_name:
                                text || undefined,
                            page: 1
                        }))
                    }
                    style={styles.searchInput}
                />

            </View>

            {/* PRICE FILTER */}

            <View style={styles.priceContainer}>

                <TextInput
                    placeholder="Min price"
                    keyboardType="numeric"
                    value={
                        query.min_price?.toString() || ""
                    }
                    onChangeText={(text) =>
                        setQuery(prev => ({
                            ...prev,
                            min_price:
                                text === ""
                                    ? undefined
                                    : Number(text),
                            page: 1
                        }))
                    }
                    style={styles.priceInput}
                />

                <TextInput
                    placeholder="Max price"
                    keyboardType="numeric"
                    value={
                        query.max_price?.toString() || ""
                    }
                    onChangeText={(text) =>
                        setQuery(prev => ({
                            ...prev,
                            max_price:
                                text === ""
                                    ? undefined
                                    : Number(text),
                            page: 1
                        }))
                    }
                    style={styles.priceInput}
                />

            </View>

            {/* CATEGORIES */}

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={
                    styles.categoryContainer
                }
            >

                <Pressable
                    style={[
                        styles.categoryButton,

                        query.category === undefined &&
                        styles.categoryButtonActive
                    ]}
                    onPress={() =>
                        setQuery(prev => ({
                            ...prev,
                            category: undefined,
                            page: 1
                        }))
                    }
                >

                    <Text
                        style={[
                            styles.categoryText,

                            query.category === undefined &&
                            styles.categoryTextActive
                        ]}
                    >
                        All
                    </Text>

                </Pressable>

                {categories.map(category => (

                    <Pressable
                        key={category.id}
                        style={[
                            styles.categoryButton,

                            query.category === category.id &&
                            styles.categoryButtonActive
                        ]}
                        onPress={() =>
                            setQuery(prev => ({
                                ...prev,
                                category: category.id,
                                page: 1
                            }))
                        }
                    >

                        <Text
                            style={[
                                styles.categoryText,

                                query.category === category.id &&
                                styles.categoryTextActive
                            ]}
                        >
                            {category.name}
                        </Text>

                    </Pressable>

                ))}

            </ScrollView>

            {/* RESOURCES */}

            <View style={styles.resourcesContainer}>

                {resources.length > 0 ? (

                    resources.map(resource => (

                        <ResourceCard
                            key={resource.id}
                            resource={resource}
                        />

                    ))

                ) : (

                    <Text style={styles.emptyText}>
                        No resources found
                    </Text>

                )}

            </View>

            {/* PAGINATION */}

            <View style={styles.paginationContainer}>

                <Pressable
                    disabled={query.page === 1}
                    style={[
                        styles.paginationButton,

                        query.page === 1 &&
                        styles.paginationButtonDisabled
                    ]}
                    onPress={() =>
                        setQuery(prev => ({
                            ...prev,
                            page: (prev.page || 1) - 1
                        }))
                    }
                >

                    <Text style={styles.paginationText}>
                        Prev
                    </Text>

                </Pressable>

                <Text style={styles.pageText}>
                    {query.page} / {totalPages}
                </Text>

                <Pressable
                    disabled={
                        (query.page || 1) >= totalPages
                    }
                    style={[
                        styles.paginationButton,

                        (query.page || 1) >= totalPages &&
                        styles.paginationButtonDisabled
                    ]}
                    onPress={() =>
                        setQuery(prev => ({
                            ...prev,
                            page: (prev.page || 1) + 1
                        }))
                    }
                >

                    <Text style={styles.paginationText}>
                        Next
                    </Text>

                </Pressable>

            </View>

        </ScrollView>
    )
}