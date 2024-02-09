const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
    container.classList.add("left-panel-active");
});

signInButton.addEventListener('click', () => {
    container.classList.remove("left-panel-active");
});