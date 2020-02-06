document.addEventListener("DOMContentLoaded", function(){
    const dropdownTriggers = document.getElementsByClassName('dropdown-trigger');
    for (let i=0; i<dropdownTriggers.length; i++) {
        const dropdownTrigger = dropdownTriggers[i];
        const target = dropdownTrigger.dataset.dropdownTarget;
        
        const dropdowns = document.getElementsByClassName(target);
        
        for (let i=0; i<dropdowns.length; i++) {

            const dropdown = dropdowns[i];
            dropdownTrigger.addEventListener('click', function () {
                dropdown.classList.toggle("visible");
                dropdownTrigger.classList.toggle("active");
            });
        }
    }

    const invisibleTrigger = document.getElementsByClassName('invisible-trigger')[0];

    invisibleTrigger.addEventListener('click', function() {
        const elements = document.querySelectorAll('.navBar li');
        for (let i=0; i<elements.length; i++) { 
    
            elements[i].classList.add('visible');
        }
        const elements2 = document.querySelectorAll('.navbar .shownav ul');
        for (let i=0; i<elements2.length; i++) { 
    
            elements2[i].classList.remove('visible');
        }
    })

});
