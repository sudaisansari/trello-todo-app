import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit"

interface Todo {
    id: string;
    todo: string;
}

interface Cards {
    id: string;
    title: string;
    inputs: {
        id: string;
        value: string;
    }[];
}


const initialState: { todos: Todo[], doing: Todo[], done: Todo[], cardsArray: Cards[] } = {
    todos: [
        {
            id: nanoid(),
            todo: "Todo 1"
        },
        {
            id: nanoid(),
            todo: "Todo 2"
        }

    ]
    , doing: []
    , done: []
    , cardsArray: []
}

const Slice = createSlice({
    name: "addUserSlice",
    initialState,
    reducers: {
        addNewInput: (state, action) => {
            console.log("Action of New Input:", action.payload);
            const { category, value } = action.payload;
            const inputdata = {
                id: nanoid(),
                value: value
            }
            console.log("Category : ", category, "New Input : ", value, "in Slice")
            state.cardsArray.find((item) => (item.title === category))?.inputs.push(inputdata)
            console.log("Input Updated : ", state.cardsArray)
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
            state.cardsArray.push(cardsData);
            console.log("Cards Array:", state.cardsArray);
        },
        updateCardTitle: (state, action) => {
            console.log("Updating Card Title")
            const { id, title } = action.payload;
            console.log("ID : ", id, "New Todo : ", title, "in Slice")
            if (id >= 0) {
                state.cardsArray[id].title = title;
                console.log("Todo Updated : ", title)
            }
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
        },
        addCardInput: (state, action) => {
            console.log("Adding New input in Card");
            const { id, input } = action.payload;
            console.log("ID : ", id, "New Todo : ", input, "in Slice");

            const card = state.cardsArray.find(card => card.id === id); // Find card by ID
            if (card) {
                const inputdata = {
                    id: nanoid(),
                    value: input
                };
                card.inputs.push(inputdata); // Push the new input into the card’s inputs
                console.log("Todo Updated : ", input);
            } else {
                console.error("Card with specified ID not found.");
            }
        },
        deleteCardInput: (state, action) => {
            console.log("Deleting New input in Card");
            const id = action.payload;
            console.log("ID to Delete : ", id);

            const card = state.cardsArray.find(card =>
                card.inputs.some(inputItem => inputItem.id === id)
            );

            if (card) {
                const inputIndex = card.inputs.findIndex(input => input.id === id); // Find input index by ID
                if (inputIndex !== -1) {
                    card.inputs.splice(inputIndex, 1); // Remove the input from the card’s inputs
                    console.log("Input Deleted");
                } else {
                    console.error("Input with specified ID not found in the card.");
                }
            } else {
                console.error("Card with specified ID not found.");
            }
        },
        deleteCard: (state, action) => {
            console.log("Deleting Card");
            const id = action.payload;
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
            console.log("ID : ", id, "New Todo : ", title, "in Slice", )
            state.cardsArray.find((item) => (item.id === id))!.title = title
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
        },
        reorderCards: (state, action: PayloadAction<{ sourceIndex: number, destinationIndex: number }>) => {
            const { sourceIndex, destinationIndex } = action.payload;
            console.log("Payload of DnD : ", action.payload);

            const [movedCard] = state.cardsArray.splice(sourceIndex, 1);
            state.cardsArray.splice(destinationIndex, 0, movedCard);
            console.log("Card Updated  : ", movedCard);
        },




        // 
        // AddTodo: (state, action) => {
        //     console.log("Action : ", action.payload)
        //     const tododata = {
        //         id: nanoid(),
        //         todo: action.payload
        //     }
        //     state.todos.push(tododata)
        // },
        // updateTodo: (state, action) => {
        //     console.log("Updating Todo")
        //     const { id, newTodo } = action.payload;
        //     console.log("ID : ", id, "New Todo : ", newTodo, "in Slice")
        //     if (id >= 0) {
        //         state.todos[id].todo = newTodo;
        //         console.log("Todo Updated : ", newTodo)
        //     }
        // },
        // AddDoing: (state, action) => {
        //     console.log("Action : ", action.payload)
        //     const Doingdata = {
        //         id: nanoid(),
        //         todo: action.payload
        //     }
        //     state.doing.push(Doingdata)
        // },
        // updateDoing: (state, action) => {
        //     console.log("Updating Todo")
        //     const { id, newTodo } = action.payload;
        //     console.log("ID : ", id, "New Todo : ", newTodo, "in Slice")
        //     if (id >= 0) {
        //         state.doing[id].todo = newTodo;
        //         console.log("Todo Updated : ", newTodo)
        //     }
        // },
        // AddDone: (state, action) => {
        //     console.log("Action : ", action.payload)
        //     const doneData = {
        //         id: nanoid(),
        //         todo: action.payload
        //     }
        //     state.done.push(doneData)
        // },
        // updateDone: (state, action) => {
        //     console.log("Updating Todo")
        //     const { id, newTodo } = action.payload;
        //     console.log("ID : ", id, "New Todo : ", newTodo, "in Slice")
        //     if (id >= 0) {
        //         state.done[id].todo = newTodo;
        //         console.log("Todo Updated : ", newTodo)
        //     }
        // },

    }
})

export const { addCardInput, addNewCard, updateCardTitle, updateCardInput, addNewInput, reorderCardItems, reorderCards, deleteCardInput, deleteCard, setCardsData, editTitle } = Slice.actions
export default Slice.reducer