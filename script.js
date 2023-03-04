let sortByDateValue = false;
const dateFormatter = (date) => {

    let dateObj = new Date(date);
    let formattedDate = dateObj.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
    });
    return formattedDate;
}

fetch("https://openapi.programming-hero.com/api/ai/tools")
    .then((response) => response.json())
    .then((data) => {
        let datafromsource = data.data.tools;
        renderCard(datafromsource, false);
        console.log(sortByDateValue)
        document.getElementById("spinner-container").classList.toggle("hide");

    });

const sortByDate = () => {
    if (document.getElementById("show-more-container").classList.contains("hide")) {
        document.getElementById("show-more-container").classList.remove("hide");
    }

    document.getElementById("spinner-container").classList.toggle("hide");
    document.getElementById("card-list").innerHTML = '';
    sortByDateValue = true;
    fetch("https://openapi.programming-hero.com/api/ai/tools")
        .then((response) => response.json())
        .then((data) => {
            let datafromsource = data.data.tools;
            datafromsource.sort((a, b) => {
                var c = new Date(a.published_in);
                var d = new Date(b.published_in);
                return c - d;
            })

            renderCard(datafromsource, false);
            document.getElementById("spinner-container").classList.toggle("hide");
        });




}


const renderCard = (data, seemore) => {

    data.forEach((item, index) => {
        console.log(index)
        if (!seemore) {
            if (index >= 6) {
                return false;
            }
            appendNewCard(item);
        } else {
            if (index < 6) {
                return false;
            }
            appendNewCard(item);
        }

    });

}

const seeMore = () => {
    document.getElementById("show-more-container").classList.toggle("hide");
    if (sortByDateValue) {

        document.getElementById("spinner-container-seemore").classList.toggle("hide");
        fetch("https://openapi.programming-hero.com/api/ai/tools")
            .then((response) => response.json())
            .then((data) => {
                let datafromsource = data.data.tools;
                datafromsource.sort((a, b) => {
                    var c = new Date(a.published_in);
                    var d = new Date(b.published_in);
                    return c - d;
                })
                renderCard(datafromsource, true);
            });
        document.getElementById("spinner-container-seemore").classList.toggle("hide");
    } else {

        document.getElementById("spinner-container-seemore").classList.toggle("hide");
        fetch("https://openapi.programming-hero.com/api/ai/tools")
            .then((response) => response.json())
            .then((data) => {
                let datafromsource = data.data.tools;
                renderCard(datafromsource, true);
            });
        document.getElementById("spinner-container-seemore").classList.toggle("hide");
    }

}

const appendNewCard = (data) => {
    let image = data.image;
    let name = data.name;
    let published_in = data.published_in;
    let id = data.id;
    let features = data.features;
    let featureRender = '';
    features.forEach((item, index) => {
        featureRender += `<li class="list-ol">${item}</li>`;;
    });
    {/* <img src="${image}" class="card-img-top rounded-3" alt="..."></img> */ }
    var div = document.createElement("div");
    div.setAttribute("class", "col-md-4 mt-4");
    div.innerHTML = `  <div class="card p-3 rounded-3">
    <div class="img-container-card" >
    <img src="${image}" class="card-img-top rounded-3" alt="..."></img> 
 </div>
<div class="card-body">
  <h5 class="card-title cardTitle">Features</h5>
  <ol class="list-items-ol">
   ${featureRender}
  </ol>
  <div class="text-success">
    <hr>
  </div>
  <div class="button-card-layer">
    <div class="d-flex justify-content-between">
        <div class="title-and-date">
            <h3>${name}</h3>
             <img src="date.png" alt="">
             <span>${dateFormatter(published_in)}</span>
        </div>
        <div class="card-footer-layer"> <button id="${id}" onclick="getDetailsSingle(this)" class="btn"  data-bs-toggle="modal" data-bs-target="#exampleModal"> <img src="arrow.png" alt=""></button></div>
       
    </div>
  </div>
</div>
</div>`;
    document.getElementById("card-list").append(div)
}


const getDetailsSingle = (e) => {
    let id = e.id;
    document.getElementById("spinner-container-modal").classList.toggle("hide");
    fetch(`https://openapi.programming-hero.com/api/ai/tool/${id}`)
        .then((response) => response.json())
        .then((data) => {
            var data = data.data;
            console.log(data)
            let accuracy = null;
            if (data.hasOwnProperty('accuracy')) {
                let accuracyObj = data.accuracy;
                if (accuracyObj.hasOwnProperty('score')) {
                    accuracy = data.accuracy.score;

                }
            }
            console.log(accuracy)
            let description = data.description;
            let features = data.features;
            let id = data.id;
            let image_link = data.image_link;
            let input_output_examples = data.input_output_examples;
            let integrations = data.integrations;
            let logo = data.logo;
            let pricing = data.pricing;
            let tool_name = data.tool_name;
            let use_cases = data.use_cases;
            let website = data.website;
            let image = image_link[0];
            var div = document.createElement("div");

            let renderPricing = '';
            let accuracyRender = '';
            if (accuracy != null) {
                accuracyRender += `<span id="badge" class="badge text-bg-danger">${accuracy * 100 + '% accuracy'}</span>`
            }

            if (pricing != null) {
                pricing.forEach((item, index) => {
                    if (index == 0) {
                        renderPricing += `<div class="btn-single-pricing basic ">
            <span class="text-truncate">${item.price}</span>
              <span class="plan">${item.plan}</span>
                  </div>`;
                    }
                    if (index == 1) {
                        renderPricing += ` <div class="btn-single-pricing pro ">
            <span class="text-truncate">${item.price}</span>
                <span class="plan">${item.plan}</span>
                    </div>`;
                    }
                    if (index == 2) {
                        renderPricing += `<div class="btn-single-pricing contact ">
            <span class="text-truncate">${item.price}</span>
                <span class="plan">${item.plan}</span>
           </div>`;
                    }

                });
            } else {
                renderPricing = `<div class="btn-single-pricing basic ">
    <span class="text-truncate">Free of Cost</span>
      <span class="plan">Basic</span>
          </div><div class="btn-single-pricing pro ">
    <span class="text-truncate">Free of Cost</span>
        <span class="plan">Pro</span>
            </div>`
                renderPricing += `<div class="btn-single-pricing contact ">
    <span class="text-truncate">Contact us</span>
        <span class="plan">Enterprise</span>
   </div>`;
            }

            let featureRender = '';

            if (features == null) {
                featureRender = "Nothing to show"
            } else {
                Object.keys(features).forEach(key => {

                    featureRender += `<li class="text-wrap">${features[key].feature_name}</li>`;
                });
            }
            let integrationRender = '';
            if (integrations == null  ) {
                console.log(integrations)
                integrationRender = "Nothing to show"
            } else {
                integrations.forEach((item, index) => {
                    integrationRender += `<li class="text-wrap">${item}</li>`;
                });
            }







            div.setAttribute("class", "container");
            div.innerHTML = ` <div class="row">
     <div class="col-md-6">
         <div class="details-card  p-4 rounded-4">
   <div class="d-flex flex-column gap-3">
     <div class="title">
        ${description}
     </div>
     <div class="pricing-button d-flex text-center justify-content-center">
     ${renderPricing}
   
     
     </div>
     <div class="d-flex flex-row">
         <div class="modal-details-footer">
             <h1>Features</h1>
             <ul>
              ${featureRender}
             </ul>
         </div>
         <div class="modal-details-footer">
             <h1>Integrations</h1>
             <ul>
             ${integrationRender}
             </ul>
         </div>
     </div>
   </div>
         </div>
     </div>
     <div class="col-md-6">
         <div class="card p-3 text-center rounded-4" >
             <div class="card-image-details">
                 <img src="${image}" class="card-img-top  rounded-3" alt="...">
                 ${accuracyRender}
             </div>
          
             <div class="card-body">
                 <h1>${input_output_examples == null ? "Can you give an example?" : input_output_examples[0].input}</h1>
               <p class="card-text">${input_output_examples == null ? "No No NO ! not yet!" : input_output_examples[0].output}</p>
             </div>
           </div>
     </div>
   </div>  `;
            document.getElementById("modalbodycontent").innerHTML = "";
            document.getElementById("spinner-container-modal").classList.toggle("hide");
            document.getElementById("modalbodycontent").append(div);
        });

}


