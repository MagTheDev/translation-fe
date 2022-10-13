
<template>

    <div class="translation-container">
        <div class="translation">
            <div class="translation-header">
                SLOVAK
            </div>
            <div class="translation-input">
                <input type="text" name="" id="" class="translation-form" v-model="slovak">
            </div>
        </div>

        <div class="translation">
                <div class="translation-header">
                ENGLISH
            </div>
            <div class="translation-input">
                <input type="text" name="" id="" class="translation-form" v-model="english">
            </div>
        </div>
        
        <div class="translation">
            <div class="translation-header">
                GERMAN
            </div>
            <div class="translation-input">
                <input type="text" name="" id="" class="translation-form" v-model="german">
            </div>
        </div>
    </div>
    <div class="button-container">
        <button class="button green" @click="shouldAdd = true">Add</button>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { add_translation } from '../api/translation_api';

const slovak = ref()
const english = ref()
const german = ref()

const toast = useToast()

const shouldAdd = ref(false)

const emit = defineEmits(['added'])

watch([shouldAdd], async () => {
    
    if (shouldAdd.value === true) {
        
        const res = await add_translation(slovak.value, english.value, german.value)
        
        if (res != null) {
            toast.success("Translation was added")
            emit('added')
            shouldAdd.value = false
        } else {
            toast.error("Something went wrong")
            shouldAdd.value = false
        }
    }

})

</script>

<style>

    .button {
		width: 7rem;
		height: 3.5rem;
		background-color: white;
		border: 1px solid black;
		margin: 10px;
		cursor: pointer;
		border-radius: 5px;
		transition: all 0.3s ease-in-out;
	}

	.green {
		color: white;
		border: none;
		background-color: #7eb81b;
		
	}

	.green:hover {
		box-shadow: 3px 2px 5px #75aa19;
	}

	.red {
		color: #F37878;
		border-color: #F37878;
	}

	.button-container {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 5px;
	}

	* {
		font-family:'Montserrat';
	}


	.clickable {
		cursor: pointer;
	}

	.dialog {
		width: 100%;
		height: 10rem;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.main {
		display: flex;
		flex-direction: row;
		width: 100%;
		height: 85%;
		align-items: center;
		justify-content: center;
	}

	.translation-container {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.translation {
		height: 15rem;
		width: 33%;
		background-color: white;
		border-radius: 5px;
		margin: 20px;
        border: 1px solid black;
	}

	.translation-header {
		margin: 10px;
		font-size: 25px;
		font-style: italic;
		color: gray;
	}

	.translation-form {
		outline: none;
		border: none;
		transition: all 0.5s ease-in-out;
		height: 100%;
		width: 100%;
		font-size: 5rem;
	}

</style>