const toggleDropdown = (dropdown) => {
    dropdown.classList.toggle("visible");
}
document.addEventListener("DOMContentLoaded", function(){
    const dropdownTriggers = document.getElementsByClassName('dropdown-trigger');
    for (let i=0; i<dropdownTriggers.length; i++) {
        const dropdownTrigger = dropdownTriggers[i];
        const target = dropdownTrigger.dataset.dropdownTarget;

        const dropdown = document.getElementById(target)
        dropdownTrigger.addEventListener('click', function () {
            toggleDropdown(dropdown);
            dropdownTrigger.classList.toggle("active");
        });
    }
});