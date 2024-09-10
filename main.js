import './style.css'

const factBoxListener = () => {
  for (const fact of document.querySelectorAll('.fact')) {
    fact.onclick = () => fact.classList.toggle('expanded');
  }
};

const setupCategoryButtons = () => {
  const buttons = document.querySelectorAll('.button-container button');
  const containers = {
    dysleksi: document.querySelector('.image-container-dysleksi'),
    dyskalkuli: document.querySelector('.image-container-dyskalkuli'),
    DLD: document.querySelector('.image-container-DLD')
  };

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const target = button.dataset.target;
      Object.keys(containers).forEach(key => {
        containers[key].style.display = key === target ? 'grid' : 'none';
      });
    });
  });


  if (buttons.length > 0) {
    buttons[0].click();
  }
};

factBoxListener();
setupCategoryButtons();
