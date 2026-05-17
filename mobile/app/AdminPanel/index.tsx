import { useAuth } from "@/context/AuthContext"
import { router } from "expo-router"
import {View, Text, FlatList, Pressable, Modal} from "react-native"
import { useEffect, useState } from "react"
import { getCategories } from "@/api/categories"
import { CategoryDto } from "@shared/types/category"


import CreateCategory from "./CreateCategory"

import { styles } from "app/styles/admin-table"
import UpdateCategory from "./UpdateCategory"

export default function AdminPanel() {

    const { user } = useAuth()

    const [categories, setCategories] =
        useState<CategoryDto[]>([])

    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showUpdateModal, setUpdateModal] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<CategoryDto | null>(null)

    const handleCreatedCategory = (
        category: CategoryDto
    ) => {
        setCategories(prev => [
            category,
            ...prev
        ])

        setShowCreateModal(false)
    }

    useEffect(() => {

        if (
            !user ||
            user.role.toLowerCase() !== "admin"
        ) {
            router.push("/")
        }

        getCategories()
            .then(setCategories)

    }, [])

    return (

        <View style={styles.container}>

            <Pressable 
                onPress={() =>
                    setShowCreateModal(true)
                }
            >
                <Text>
                    Create Category
                </Text>

            </Pressable>

            <View style={styles.tableContainer}>

                {/* Header */}

                <View style={styles.tableHeader}>

                    <Text 
                        style={[
                            styles.headerText, 
                            styles.idColumn
                        ]}>
                        ID
                    </Text>

                    <Text
                        style={[
                            styles.headerText, 
                            styles.headerText
                        ]}
                    >
                        Name
                    </Text>

                    <Text 
                        style={[
                            styles.headerText,
                            styles.movableColumn
                        ]}>
                        Movable
                    </Text>

                </View>

                {/* Rows */}

                <FlatList
                    data={categories}
                    keyExtractor={(item) =>
                        item.id.toString()
                    }
                    renderItem={({ item }) => (

                        <View style={styles.tableRow}>

                            <Text
                                style={[
                                    styles.rowText,
                                    styles.idColumn
                                ]}
                            >
                                #{item.id}
                            </Text>

                            <View style={styles.nameColumn}>
                                <Text style={styles.categoryName}>
                                    {item.name}
                                </Text>
                            </View>

                            <View style={styles.movableColumn}>

                                <View
                                    style={[
                                        styles.movableBadge,

                                        item.is_movable
                                            ? styles.movableBadgeActive
                                            : styles.movableBadgeInactive
                                    ]}
                                >

                                    <Text
                                        style={
                                            item.is_movable
                                                ? styles.movableTextActive
                                                : styles.movableTextInactive
                                        }
                                    >
                                        {item.is_movable
                                            ? "Movable"
                                            : "Static"}
                                    </Text>

                                </View>

                            </View>

                            <View style={styles.actionsColumn}>

                                <View style={styles.actionButtons}>

                                    <Pressable
                                        style={styles.updateButton}
                                        onPress={() => {

                                            setSelectedCategory(item)
                                            setUpdateModal(true)

                                            console.log(
                                                "Update category:",
                                                item.id
                                            )

                                        }}
                                    >

                                        <Text
                                            style={styles.actionButtonText}
                                        >
                                            Update
                                        </Text>

                                    </Pressable>

                                </View>

                            </View>

                        </View>
                    )}
                />

            </View>

            <Modal
                visible={showUpdateModal}
                transparent
                animationType="slide"
            >
                <View style={styles.modalOverlay}>

                    <View style={styles.modalContainer}>

                        <View style={styles.modalHeader}>

                            <Text style={styles.modalTitle}>
                                Update Category
                            </Text>

                            <Pressable
                                style={styles.closeButton}
                                onPress={() =>
                                    setUpdateModal(false)
                                }
                            >
                                <Text style={styles.closeButtonText}>
                                    ✕
                                </Text>
                            </Pressable>

                        </View>

                        <View style={styles.modalContent}>
                            { selectedCategory &&
                                <UpdateCategory
                                    category={selectedCategory}
                                />
                            }
                        </View>

                    </View>

                </View>
            </Modal>

            <Modal
                visible={showCreateModal}
                transparent
                animationType="slide"
            > 
                <View style={styles.modalOverlay}>

                    <View style={styles.modalContainer}>

                        <View style={styles.modalHeader}>

                            <Text style={styles.modalTitle}>
                                Create Category
                            </Text>

                            <Pressable
                                style={styles.closeButton}
                                onPress={() =>
                                    setShowCreateModal(false)
                                }
                            >
                                <Text style={styles.closeButtonText}>
                                    ✕
                                </Text>
                            </Pressable>

                        </View>

                        <View style={styles.modalContent}>
                            <CreateCategory modal onCreated={handleCreatedCategory}/>
                        </View>

                    </View>

                </View>
            </Modal>

        </View>
    )
}