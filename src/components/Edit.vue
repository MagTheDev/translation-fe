<template>

	<div class="translation-container">
		<div class="translation">
			<div class="translation-header">
				SLOVAK
			</div>
			<div class="translation-input">
				<input type="text" name="" id="" class="translation-form" v-model="translation.slovak">
			</div>
		</div>

		<div class="translation">
			<div class="translation-header">
				ENGLISH
			</div>
			<div class="translation-input">
				<input type="text" name="" id="" class="translation-form" v-model="translation.english">
			</div>
		</div>

		<div class="translation">
			<div class="translation-header">
				GERMAN
			</div>
			<div class="translation-input">
				<input type="text" name="" id="" class="translation-form" v-model="translation.german">
			</div>
		</div>
	</div>
	<div class="button-container">
		<button class="button green" @click="shouldEdit = true">Edit</button>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { TranslationRequest } from '../api/translation';
import { edit_translation } from '../api/translation_api';

const props = defineProps<{
	slovak: string;
	english: string;
	german: string;
	toEdit: string;
}>();


const toast = useToast()

const translation = reactive({
	slovak: props.slovak,
	english: props.english,
	german: props.german,
	toEdit: props.toEdit,
});

const shouldEdit = ref(false)

const emit = defineEmits(['edited'])

watch([shouldEdit], async () => {

	const newTranslation: TranslationRequest = {
		words: [
			{ language: "SLOVAK", translation: translation.slovak },
			{ language: "ENGLISH", translation: translation.english },
			{ language: "GERMAN", translation: translation.german },
		],
	}

	const res = await edit_translation(translation.toEdit, newTranslation)

	if (res !== null) {
		toast.success("The translation was edited successfully")
		emit('edited')
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
	font-family: 'Montserrat';
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