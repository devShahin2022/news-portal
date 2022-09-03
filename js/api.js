// =====================================
//          selector functions
// =====================================
// id selector
const id = id => {
    return document.getElementById(id);
}
// class selector
const _class = className => {
    return document.getElementsByClassName(className);
}
// =====================================
//          category fetching
// =====================================
const categoryFetchData = () => {
    const url = "https://openapi.programming-hero.com/api/news/categories";
    fetch(url)
    .then(res => res.json())
    .then(res => {
        categoriesLoad(res);
    })
    .catch(error => console.log(error));
}
categoryFetchData();
// categories name load into navbar
const categoriesLoad = category =>{
    id("categories-push-id").innerHTML = '';
    // console.log(category.data.news_category);
    let i = 0;
    category.data.news_category.forEach(eachCategory => {

        id("categories-push-id").innerHTML += `
        <li data-cat-id=${eachCategory.category_id} onclick="showDataByCategory(${i})" class="nav-item cat-nav-item mx-2 p-2">
            ${eachCategory.category_name}
        </li>
    `;
    i++;
    });
    // init data load
    showDataByCategory(0);
}
// function fetch serial and id clicking category name
const showDataByCategory = (CatSerial) => {
    // click preloader
        id("news-push-id").innerHTML = `
        <div class="d-flex align-items-center my-3 justify-content-center">
            <p class="nav-item">
            <div class="spinner-grow" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            </p>
            <p>
            Please wait...
            </p>
        </div>
    `
    id("data-found-result").innerHTML = `
        <div class="d-flex align-items-center my-3 justify-content-center">
            <p class="nav-item">
            <div class="spinner-grow" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            </p>
            <p>
            Calculating...
            </p>
        </div>
    `
    // remove prev active status
    activeClassRemove();
    const selectCategoryNames = _class("cat-nav-item");
    const tarCatId = selectCategoryNames[CatSerial].getAttribute("data-cat-id");
    selectCategoryNames[CatSerial].classList.add("active-cat");
    fetchCatData(tarCatId, CatSerial);
}
// active class remove
const activeClassRemove = () => {
    const selectAllCatClass = _class("cat-nav-item");
    for (const eachCatClassName of selectAllCatClass) {
        eachCatClassName.classList.remove("active-cat");
    }
}

// data fetch by clicking specifing id
const fetchCatData = (tarCatId, CatSerial) => {
    const url = `https://openapi.programming-hero.com/api/news/category/${tarCatId}`;
    fetch(url)
    .then(res => res.json())
    .then(res => {
        // console.log(res);
        newsDataLoad(res, CatSerial,tarCatId );
    })
    .catch(error => console.log(error));
}
// each news data load into html template
const newsDataLoad = (newsData, CatSerial, tarCatId) => {
    // alert(tarCatId);
    id("cat-id").value = tarCatId ;
    // console.log(newsData);
    const tarCatName = _class("cat-nav-item")[CatSerial].innerText;
    id("news-push-id").innerHTML = '';
    if(newsData.status === true){
        // console.log(newsData.data[0]);
        const NumberOfNews = newsData.data.length;
        id("data-found-result").innerText = `${NumberOfNews} items found for category ${tarCatName}`;
        // data sort
        newsData.data.sort((a, b) => {return b.total_view - a.total_view});
        let details = '';
        let i = 0;
        for (const eachNewsData of newsData.data) {
            if(eachNewsData.details.length > 300){
                details = eachNewsData.details.slice(0, 300)+'...';
            }else{
                details = '';
                details = eachNewsData.details; 
            }
            id("news-push-id").innerHTML += `
                <div class="row g-0 my-3">
                <div class="col-md-4">
                <img src="${eachNewsData.thumbnail_url}" class="img-fluid w-75 rounded-start thumbnail" alt="...">
                </div>
                <div class="col-md-8">
                <div class="card-body">
                    <h2 onclick='modalOpen(${i})' cat-id=${tarCatId}  class="card-title news-card-title"  data-bs-toggle="modal" data-bs-target="#exampleModal" >${eachNewsData.title || "Title not found!"}</h2>
                    <p class="card-text">${details}</p>
                </div>
                <!-- card bottom summery -->
                <div class="ps-2 row">
                    <div class="d-flex align-items-center col-9 col-md-4 col-lg-4">
                        <div class="profile-wrap d-flex justify-content-center align-items-center">
                            <img class="news-publisher"  src="${eachNewsData.author.img}" alt="image">
                        </div>
                        <div class="ms-2">
                            <span class="h5">${eachNewsData.author.name || "Author name not Found!"}</span><br>
                            <span class="text-muted">${eachNewsData.author.published_date || "Published date not found!"}</span>
                        </div>
                    </div>
                    <div class="col-3 col-md-2 col-lg-2">
                        <h5><i class="fa-regular fa-eye"></i> ${eachNewsData.total_view || "Total view not found!"}</h5>
                    </div>
                    <div class="col-9 col-md-4 col-lg-4 icons">
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-regular fa-star-half-stroke"></i>
                        <span>(${eachNewsData.rating.number})</span>
                    </div>
                    <div class="col-3 col-md-2 col-lg-2">
                        <div onclick='modalOpen(${i})' class="arrow-box d-flex justify-content-center align-items-center"  data-bs-toggle="modal" data-bs-target="#exampleModal">
                        <i class="fa-solid fa-arrow-right"></i> 
                        </div>
                    </div>
                </div>
                </div>
            </div>
            
            `;
            i++;
        }
    }else{
        id("data-found-result").innerText = `Oops! no data found for ${tarCatName} category`;
        id("news-push-id").innerHTML = `
            <h3 class='bg-alert'> No data found </h1>
        `;
    }
}

// init data load
showDataByCategory(1);

function modalOpen(clickedNews){
    id("modal-news-push-id").innerHTML = `
        <div class="d-flex align-items-center my-3 justify-content-center">
            <p class="nav-item">
            <div class="spinner-grow" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            </p>
            <p>
            data fetching...
            </p>
        </div>
    `;
    const tarCatId = id("cat-id").value;
    const url = `https://openapi.programming-hero.com/api/news/category/${tarCatId}`;
    fetch(url)
    .then(data => data.json())
    .then(data => {
        // console.log(data);
        newsLoadInModal(data, clickedNews);
    })
    .catch(error => console.log(error));
}

// news data load
function newsLoadInModal(data, clickedNews) {

    // data sort
    data.data.sort((a, b) => {return b.total_view - a.total_view});
    console.log(data.data[clickedNews].total_view);

    id("modal-news-push-id").innerHTML = '';
    id("modal-news-push-id").innerHTML = `
        <div class="row">
            <div class="col-12 col-md-4 col-lg-4">
                <img class="w-100" src="${data.data[clickedNews].thumbnail_url}" alt="images">
                </div>
                <div class="col-12 col-md-8 col-lg-8">
                <h2 class="my-2">${data.data[clickedNews].title || "Title not found!"}</h2>
                <p class="my-3">${data.data[clickedNews].details || "Details not found!"}</p>
                <div class="row my-4">
                    <div class="col-5 col-md-5 col-lg-5">
                        <img src="${data.data[clickedNews].author.img}" style="width:50px; height:50px; border-radius:50%;">
                        <h5>${data.data[clickedNews].author.name || "Name not found!"}</h5>
                        <p>${data.data[clickedNews].author.published_date || "date not found!"}</p>
                    </div>
                    <div class="col-4 col-md-4 col-lg-4"><h5><i class="fa-regular fa-eye"></i> ${data.data[clickedNews].total_view || "total View not found!"}</h5></div>
                    <div class="col-3 col-md-3 col-lg-3">
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-solid fa-star"></i>
                        <i class="fa-regular fa-star-half-stroke"></i>
                        <span>(${data.data[clickedNews].rating.number})</span>
                    </div>
                </div>
            </div>
    </div>
    `;
}