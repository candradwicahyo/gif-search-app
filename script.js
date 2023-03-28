window.onload = () => {
  
  const options = [
    'smile',
    'laugh',
    'throw',
    'sad',
    'friend',
    'happy'
  ];
  
  const content = document.querySelector('.content');
  const option = options[Math.floor(Math.random() * options.length)];
  
  // load data 
  async function loadData(value = 'happy') {
    try {
      const data = await fetchData(value);
      updateUI(data);
    } catch (error) {
      const message = error.message;
      content.innerHTML = showError(message);
    }
  }
  
  loadData(option);
  
  // fetch data 
  function fetchData(value) {
    return fetch(`https://g.tenor.com/v1/search?q=${value}&key=LIVDSRZULELA&limit=9`)
      .then(response => response.json())
      .then(response => {
        if (response.next == 0) throw new Error('gif not found!');
        return response.results;
      })
      .catch(error => {
        throw new Error(error);
      });
  }
  
  // error 
  function showError(message) {
    return `
    <div class="col-md-7 my-3 mx-auto">
      <div class="alert alert-danger rounded-0" role="alert">
        <h3 class="fw-normal mb-1">Alert</h3>
        <span class="fw-light">${message}</span>
      </div>
    </div>
    `;
  }
  
  function updateUI(param) {
    content.innerHTML = '';
    let string = '';
    param.forEach(data => string += showUI(data));
    content.insertAdjacentHTML('beforeend', string);
  }
  
  function showUI({ content_description: description, media }) {
    return `
    <div class="col-md-6">
      <div class="bg-white p-3 rounded-1 shadow-sm my-2">
        <img src="${media[0].gif.url}" class="img-fluid rounded-1">
        <span class="d-block fw-normal mt-4">${description}</span>
        <input type="text" class="opacity-0" value="${media[0].webm.url}" readonly>
        <button class="btn btn-primary rounded-0 btn-copy">copy link</button>
      </div>
    </div>
    `;
  }
  
  // plugin sweetalert
  function alerts(icon, title, text) {
    swal.fire ({
      icon: icon,
      title: title,
      text: text
    });
  }
  
  // search and load data 
  const searchInput = document.querySelector('.search-input');
  const btnSubmit = document.querySelector('.btn-submit');
  btnSubmit.addEventListener('click', () => {
    if (!searchInput.value) return alerts('error', 'Alert', 'Input was empty!');
    const value = searchInput.value.trim();
    loadData(value);
  });
  
  // copy link 
  window.addEventListener('click', event => {
    if (event.target.classList.contains('btn-copy')) {
      event.target.previousElementSibling.select();
      document.execCommand('copy');
      alerts('success', 'success', 'Link has been copied!');
    }
  });
  
}