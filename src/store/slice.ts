import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit"
import { Cards } from "@/types/types"
import { addCardToFirestore, cardSignUp, deleteInputFromFirestore, updateCardsDataInFirestore } from "@/config/firebase";

interface UserInfo {
    email: string;
    id: string;
}

interface InitialState {
    cardsArray: Cards[];
    user: UserInfo | null;
}

const initialState: InitialState = {
    cardsArray: [],
    user: null
}

const Slice = createSlice({
    name: "addUserSlice",
    initialState,
    reducers: {
        signupUpdate: (state) => {
            const uid = state.user?.id
            if (uid) {
                cardSignUp(uid)
            }
        },
        loggedInUser: (state, action) => {
            const { email, id } = action.payload
            state.user = { email, id }
        },
        loggedOutUser: (state) => {
            state.user = null
        },
        addNewInput: (state, action) => {
            console.log("Action of New Input:", action.payload);
            const { id, value } = action.payload;
            const inputdata = {
                id: nanoid(),
                value: value,
                description: "",
                activity: [],
                watching: false,
                dateTime: new Date().toLocaleString('en-US', {
                    timeZone: 'Asia/Karachi',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true
                })
            }
            console.log("Category : ", id, "New Input : ", value, "in Slice")
            state.cardsArray.find((item) => (item.id === id))?.inputs.push(inputdata)
            console.log("Input Updated : ", state.cardsArray)
            const data = state.cardsArray.map(item => item)
            const updatedData = JSON.parse(JSON.stringify(data))
            const uid = state.user?.id
            if (uid) {
                updateCardsDataInFirestore(uid, updatedData)
            }
            console.log("UD ", updatedData);
        },
        addNewCard: (state, action) => {
            console.log("Action of Title New Card:", action.payload);
            const category = action.payload;
            console.log("Category : ", category)
            const cardsData = {
                id: nanoid(),
                title: category,
                inputs: []
            };

            const uid = state.user?.id
            if (uid) {
                addCardToFirestore(uid, cardsData)
            }
            //state.cardsArray.push(cardsData);
            console.log("Cards Array:", state.cardsArray);
        },
        updateCardTitle: (state, action) => {
            console.log("Updating Card Title")
            const { id, title } = action.payload;
            console.log("ID : ", id, "New Todo : ", title, "in Slice")
            if (id >= 0) {
                state.cardsArray[id].title = title;
                console.log("Todo Updated : ", title)
            } else {
                console.log("Error updating title")
            }
            const data = state.cardsArray.map(item => item)
            const updatedData = JSON.parse(JSON.stringify(data))
            const uid = state.user?.id
            if (uid) {
                updateCardsDataInFirestore(uid, updatedData)
            }
            console.log("UD ", updatedData);
        },
        updateCardInput: (state, action) => {
            console.log("Updating Card Title");
            const { id, input } = action.payload; // `id` should be the input ID, not the array index.
            console.log("Input ID:", id, "New Value:", input, "in Slice");

            // Find the card that contains the input you want to update
            const card = state.cardsArray.find(card =>
                card.inputs.some(inputItem => inputItem.id === id)
            );

            if (card) {
                // Find the specific input within the card by ID and update its value
                const inputToUpdate = card.inputs.find(inputItem => inputItem.id === id);
                if (inputToUpdate) {
                    inputToUpdate.value = input;
                    console.log("Todo Updated:", input);
                } else {
                    console.error("Input with specified ID not found in the card.");
                }
            } else {
                console.error("Card containing the specified input ID not found.");
            }
            const data = state.cardsArray.map(item => item)
            const updatedData = JSON.parse(JSON.stringify(data))
            const uid = state.user?.id
            if (uid) {
                updateCardsDataInFirestore(uid, updatedData)
            }
            console.log("UD ", updatedData);
        },
        addCardInput: (state, action) => {
            console.log("Adding New input in Card");
            const { id, input } = action.payload;
            console.log("ID : ", id, "New Todo : ", input, "in Slice");

            const card = state.cardsArray.find(card => card.id === id); // Find card by ID
            if (card) {
                const inputdata = {
                    id: nanoid(),
                    value: input,
                    description: "",
                    activity: [],
                    watching: false,
                    dateTime: new Date().toLocaleString('en-US', {
                        timeZone: 'Asia/Karachi',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true
                    })
                };
                card.inputs.push(inputdata); // Push the new input into the card’s inputs
                console.log("Todo Updated : ", inputdata);
            } else {
                console.error("Card with specified ID not found.");
            }
            const data = state.cardsArray.map(item => item)
            const updatedData = JSON.parse(JSON.stringify(data))
            const uid = state.user?.id
            if (uid) {
                updateCardsDataInFirestore(uid, updatedData)
            }
            console.log("UD ", updatedData);
        },
        deleteCardInput: (state, action) => {
            //console.log("Deleting New input in Card");
            const id = action.payload;
            console.log("ID to Delete : ", id);
            const uid = state.user?.id
            if (uid) {
                deleteInputFromFirestore(uid, id)
            }
            // const card = state.cardsArray.find(card =>
            //     card.inputs.some(inputItem => inputItem.id === id)
            // );

            // if (card) {
            //     const inputIndex = card.inputs.findIndex(input => input.id === id); // Find input index by ID
            //     if (inputIndex !== -1) {
            //         card.inputs.splice(inputIndex, 1); // Remove the input from the card’s inputs
            //         console.log("Input Deleted");
            //     } else {
            //         console.error("Input with specified ID not found in the card.");
            //     }
            // } else {
            //     console.error("Card with specified ID not found.");
            // }
        },
        deleteCard: (state, action) => {
            console.log("Deleting Card");
            const id = action.payload;
            // deleteCardFromFirestore(user?.uid, id)
            console.log("ID to Delete : ", id);
            const cardIndex = state.cardsArray.findIndex(card => card.id === id);
            if (cardIndex !== -1) {
                state.cardsArray.splice(cardIndex, 1); // Remove the card from the cardsArray
                console.log("Card Deleted");
            } else {
                console.error("Card with specified ID not found.");
            }
        },
        setCardsData: (state, action) => {
            state.cardsArray = action.payload; // Sets the value of cardsArray
            console.log("Card Set  : ", state.cardsArray)
        },
        editTitle: (state, action) => {
            console.log("Editing Title")
            const { id, title } = action.payload;
            console.log("ID : ", id, "New Todo : ", title, "in Slice",)
            state.cardsArray.find((item) => (item.id === id))!.title = title
            const data = state.cardsArray.map(item => item)
            const updatedData = JSON.parse(JSON.stringify(data))
            console.log("title edited", updatedData);
            const uid = state.user?.id
            if (uid) {
                updateCardsDataInFirestore(uid, updatedData)
            }
        },
        addDescription: (state, action) => {
            console.log("Adding Description")
            const { id, description } = action.payload;
            console.log("ID : ", id, "New Description : ", description, "in Slice",)

            const card = state.cardsArray.find(card =>
                card.inputs.some(inputItem => inputItem.id === id)
            );

            if (card) {
                // Find the specific input within the card by ID and update its value
                const descToAdd = card.inputs.find(inputItem => inputItem.id === id);
                if (descToAdd) {
                    descToAdd.description = description;
                    console.log("Todo Updated:", description);
                } else {
                    console.error("Input with specified ID not found in the card.");
                }
            } else {
                console.error("Card containing the specified input ID not found.");
            }
            const data = state.cardsArray.map(item => item)
            const updatedData = JSON.parse(JSON.stringify(data))
            const uid = state.user?.id
            if (uid) {
                updateCardsDataInFirestore(uid, updatedData)
            }
            console.log("UD ", updatedData);
        },
        addWatchingState: (state, action) => {
            console.log("Adding Watching State")
            const { id, watching } = action.payload;
            //console.log("ID : ", id, "New Watching : ", watching, "in Slice",)

            const card = state.cardsArray.find(card =>
                card.inputs.some(inputItem => inputItem.id === id)
            );

            if (card) {
                // Find the specific input within the card by ID and update its value
                const watchToAdd = card.inputs.find(inputItem => inputItem.id === id);
                if (watchToAdd) {
                    watchToAdd.watching = watching;
                    console.log("Todo Updated:",);
                } else {
                    console.error("Input with specified ID not found in the card.");
                }
            } else {
                console.error("Card containing the specified input ID not found.");
            }
            const data = state.cardsArray.map(item => item)
            const updatedData = JSON.parse(JSON.stringify(data))
            const uid = state.user?.id
            if (uid) {
                updateCardsDataInFirestore(uid, updatedData)
            }
            console.log("UD ", updatedData);
        },
        updateDescription: (state, action) => {
            console.log("Updating Description");
            const { id, description } = action.payload; // Extract the input ID and the updated description from the action payload.
            console.log("ID:", id, "Updated Description:", description);

            // Find the card that contains the input with the specified ID.
            const card = state.cardsArray.find(card =>
                card.inputs.some(inputItem => inputItem.id === id)
            );

            if (card) {
                console.log("Found Card:", card);

                // Find the specific input within the card by ID and update its description.
                const inputToUpdate = card.inputs.find(inputItem => inputItem.id === id);

                if (inputToUpdate) {
                    inputToUpdate.description = description; // Update the description.
                    console.log("Description Updated:", inputToUpdate.description);
                } else {
                    console.error("Input with the specified ID not found in the card.");
                }
            } else {
                console.error("Card containing the specified input ID not found.");
            }
            const data = state.cardsArray.map(item => item)
            const updatedData = JSON.parse(JSON.stringify(data))
            const uid = state.user?.id
            if (uid) {
                updateCardsDataInFirestore(uid, updatedData)
            }
            console.log("UD ", updatedData);
        },



        addActivity: (state, action) => {
            console.log("Adding Activity")
            const { id, activity } = action.payload;
            console.log("ID : ", id, "New Activity : ", activity, "in Slice",)

            const data = {
                id: nanoid(),
                content: activity,
                dateTime: new Date().toLocaleString('en-US', {
                    timeZone: 'Asia/Karachi',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true
                })
            }

            const card = state.cardsArray.find(card =>
                card.inputs.some(inputItem => inputItem.id === id)
            );

            if (card) {
                // Find the specific input within the card by ID and update its value
                const activityToAdd = card.inputs.find(inputItem => inputItem.id === id);
                if (activityToAdd) {
                    activityToAdd.activity.push(data);
                    console.log("Activity Updated:", data);
                } else {
                    console.error("Input with specified ID not found in the card.");
                }
            } else {
                console.error("Card containing the specified input ID not found.");
            }
            const dataU = state.cardsArray.map(item => item)
            const updatedData = JSON.parse(JSON.stringify(dataU))
            const uid = state.user?.id
            if (uid) {
                updateCardsDataInFirestore(uid, updatedData)
            }
            console.log("UD ", updatedData);
        },
        updateActivity: (state, action) => {
            console.log("Editing Activity");
            const { id, activity } = action.payload; // `id` is the activity's ID, and `activity` is the new content.
            console.log("ID:", id, "New Activity:", activity);

            // Find the card that contains the activity with the given `id`.
            const card = state.cardsArray.find(card =>
                card.inputs.some(inputItem =>
                    inputItem.activity.some(activityItem => activityItem.id === id)
                )
            );

            if (card) {
                console.log("Found Card:", card);

                // Find the input that contains the activity.
                const inputWithActivity = card.inputs.find(inputItem =>
                    inputItem.activity.some(activityItem => activityItem.id === id)
                );

                if (inputWithActivity) {
                    // Find the specific activity by its ID and update its content.
                    const activityToEdit = inputWithActivity.activity.find(activityItem => activityItem.id === id);

                    if (activityToEdit) {
                        activityToEdit.content = activity; // Update the content of the activity.
                        console.log("Activity Updated:", activityToEdit);
                    } else {
                        console.error("Activity with specified ID not found.");
                    }
                } else {
                    console.error("Input with specified activity ID not found.");
                }
            } else {
                console.error("Card containing the specified activity ID not found.");
            }
            const data = state.cardsArray.map(item => item)
            const updatedData = JSON.parse(JSON.stringify(data))
            const uid = state.user?.id
            if (uid) {
                updateCardsDataInFirestore(uid, updatedData)
            }
            console.log("UD ", updatedData);
        },
        deleteActivity: (state, action) => {
            console.log("Deleting Activity");
            const id = action.payload; // `id` is the activity's ID.
            console.log("ID to Delete:", id);

            // Find the card that contains the activity with the given `id`.
            const card = state.cardsArray.find(card =>
                card.inputs.some(inputItem =>
                    inputItem.activity.some(activityItem => activityItem.id === id)
                )
            );

            if (card) {
                console.log("Found Card:", card);

                // Find the input that contains the activity.
                const inputWithActivity = card.inputs.find(inputItem =>
                    inputItem.activity.some(activityItem => activityItem.id === id)
                );

                if (inputWithActivity) {
                    // Find the specific activity by its ID and remove it.
                    const activityIndex = inputWithActivity.activity.findIndex(activityItem => activityItem.id === id);

                    if (activityIndex !== -1) {
                        inputWithActivity.activity.splice(activityIndex, 1); // Remove the activity.
                        console.log("Activity Deleted");
                    } else {
                        console.error("Activity with specified ID not found.");
                    }
                } else {
                    console.error("Input with specified activity ID not found.");
                }
            } else {
                console.error("Card containing the specified activity ID not found.");
            }
            const data = state.cardsArray.map(item => item)
            const updatedData = JSON.parse(JSON.stringify(data))
            const uid = state.user?.id
            if (uid) {
                updateCardsDataInFirestore(uid, updatedData)
            }
            console.log("UD ", updatedData);
        },


        reorderCardItems: (state, action: PayloadAction<{ sourceCardId: string, destinationCardId: string, sourceIndex: number, destinationIndex: number }>) => {
            const { sourceCardId, destinationCardId, sourceIndex, destinationIndex } = action.payload;
            console.log("Payload of DnD : ", action.payload);

            const cardIndex = state.cardsArray.findIndex(card => card.id === destinationCardId);
            console.log("Card of Dest Index : ", cardIndex)
            const card = state.cardsArray[cardIndex];

            const cardIndexSource = state.cardsArray.findIndex(card => card.id === sourceCardId);
            console.log("Card of Source Index : ", cardIndexSource)
            const cardSource = state.cardsArray[cardIndexSource];

            // For same card Inputs Change
            if (card && sourceIndex !== destinationIndex && sourceCardId === destinationCardId) {
                console.log("Same card")
                // Clone the inputs array to avoid direct mutation of the proxy state
                const updatedInputs = [...card.inputs];

                // Move the item
                const [movedItem] = updatedInputs.splice(sourceIndex, 1);
                updatedInputs.splice(destinationIndex, 0, movedItem);

                // Update the specific card in cardsArray
                state.cardsArray[cardIndex] = { ...card, inputs: updatedInputs };
                console.log("Card Updated in Slice : ", state.cardsArray[cardIndex]);
            }
            // For other card Inputs Change
            else if (card && sourceCardId !== destinationCardId) {
                console.log("Other card")
                // Clone the inputs array to avoid direct mutation of the proxy state
                const updatedInputsSource = [...cardSource.inputs];
                const updateInputsDest = [...card.inputs]

                // Move the item
                const [movedItem] = updatedInputsSource.splice(sourceIndex, 1);
                updateInputsDest.splice(destinationIndex, 0, movedItem);

                // Update the specific card in cardsArray
                state.cardsArray[cardIndex] = { ...card, inputs: updateInputsDest };
                state.cardsArray[cardIndexSource] = { ...cardSource, inputs: updatedInputsSource };
                console.log("Card Updated in Slice : ", state.cardsArray[cardIndex]);
            }
            else {
                console.error("Failed to find card or invalid indices.");
            }
            const data = state.cardsArray.map(item => item)
            const updatedData = JSON.parse(JSON.stringify(data))
            const uid = state.user?.id
            if (uid) {
                updateCardsDataInFirestore(uid, updatedData)
            }
            console.log("UD ", updatedData);
        },
        reorderCards: (state, action: PayloadAction<{ sourceIndex: number, destinationIndex: number }>) => {
            const { sourceIndex, destinationIndex } = action.payload;
            console.log("Payload of DnD : ", action.payload);

            const [movedCard] = state.cardsArray.splice(sourceIndex, 1);
            state.cardsArray.splice(destinationIndex, 0, movedCard);
            console.log("Card Updated  : ", movedCard);
            const data = state.cardsArray.map(item => item)
            const updatedData = JSON.parse(JSON.stringify(data))
            const uid = state.user?.id
            if (uid) {
                updateCardsDataInFirestore(uid, updatedData)
            }
            console.log("UD ", updatedData);
        },
    }
})

export const { addCardInput, addNewCard, updateCardTitle, updateCardInput, addNewInput, reorderCardItems, reorderCards, deleteCardInput, deleteCard, setCardsData, editTitle, addDescription, addActivity, updateActivity, deleteActivity, updateDescription, addWatchingState, loggedInUser, loggedOutUser, signupUpdate } = Slice.actions
export default Slice.reducer