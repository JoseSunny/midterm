const Order = require("./Order");

const OrderState = Object.freeze({
    WELCOMING: Symbol("welcoming"),
    ITEM: Symbol("item"),
    MoreItems: Symbol("moreitems"),
    UPSELLCHECK: Symbol("upsellcheck"),
    TOTALCALC: Symbol("totalcalc"),
    UPSELLINITIALCHECK: Symbol("totalcalc")
});

let EnteredItem;
let EnteredUpsell
let i = 0;
let j = 0;
let ItemsPurchased = [2];
let UpSellItem = [2];
let total = 0;
let tax=0;
module.exports = class LockDownEssentials extends Order {
    constructor(sNumber, sUrl) {
        super(sNumber, sUrl);
        this.stateCur = OrderState.WELCOMING;
        this.sItem = "";
    }
    handleInput(sInput) {
        let aReturn = [];
        switch (this.stateCur) {

            case OrderState.WELCOMING:
                this.stateCur = OrderState.ITEM;
                aReturn.push("Welcome to Home Hardware @Curbside");
                aReturn.push(`For a list of what we sell tap:`);
                aReturn.push(`${this.sUrl}/payment/${this.sNumber}/`);
                aReturn.push(`Please enter the product you would like to purchase`);
                break;
            case OrderState.ITEM:
                EnteredItem = sInput.toLowerCase();
                if ((EnteredItem == "broom") || (EnteredItem == "dustbin") || (EnteredItem == "snow shovels") || (EnteredItem == "bulb") || (EnteredItem == "household cleaners")) {
                    ItemsPurchased[i] = sInput;
                    if (EnteredItem == "broom") {
                        total = total + 5;
                    }
                    if (EnteredItem == "dustbin") {
                        total = total + 10;
                    }
                    if (EnteredItem == "snow shovels") {
                        total = total + 15;
                    }
                    if (EnteredItem == "bulb") {
                        total = total + 8;
                    }
                    if (EnteredItem == "household cleaners") {
                        total = total + 25;
                    }
                    aReturn.push("Item added to Cart");
                    this.stateCur = OrderState.MoreItems;
                    aReturn.push("Would you like to purchase more item  : (yes or No)");
                }
                else {
                    aReturn.push(`${sInput} is not a valid entry , Please select an item from the below list`);
                    aReturn.push(`${this.sUrl}/payment/${this.sNumber}/`);
                }
                break;

            case OrderState.MoreItems:

                if ((sInput.toLowerCase() == "yes") || (sInput.toLowerCase() == "no")) {

                    if (sInput.toLowerCase() == "yes") {
                        aReturn.push("Select an item from the below list");
                        aReturn.push(`${this.sUrl}/payment/${this.sNumber}/`);
                        this.stateCur = OrderState.ITEM;
                        i = i + 1;
                    }
                    else if (sInput.toLowerCase() == "no") {
                        this.stateCur = OrderState.UPSELLINITIALCHECK;
                        aReturn.push("Would you like to purchase any of the below item (Yes or No)");
                        aReturn.push(" \n * simoniz car cloths \n * geeky headlamps \n * earbuds ");
                    }
                }
                else {
                    aReturn.push(`${sInput} is not a valid entry , Please select Yes or No `);
                }
                break;

            case OrderState.UPSELLINITIALCHECK:

                if ((sInput.toLowerCase() == "yes") || (sInput.toLowerCase() == "no")) {
                    if (sInput.toLowerCase() == "yes") {
                        aReturn.push("Please select the item \n * simoniz car cloths \n * geeky headlamps \n * earbuds ");
                        this.stateCur = OrderState.UPSELLCHECK;
                    }

                    if (sInput.toLowerCase() == "no") {
                        this.stateCur = OrderState.TOTALCALC;

                    }

                }
                else {
                    aReturn.push(`${sInput} is not a valid entry , Please select Yes or No `);
                }
                break;

            case OrderState.UPSELLCHECK:
                EnteredUpsell = sInput.toLowerCase();
                if ((EnteredUpsell == "earbuds") || (EnteredUpsell == "simoniz car cloths") || (EnteredUpsell == "geeky headlamps")) {
                    this.stateCur = OrderState.TOTALCALC;

                    UpSellItem[j] = sInput;
                    aReturn.push("Item added to Cart");

                    if (EnteredUpsell == "simoniz car cloths") {
                        total = total + 4;
                    }
                    if (EnteredUpsell == "geeky headlamps") {
                        total = total + 11;
                    }
                    if (EnteredUpsell == "earbuds") {
                        total = total + 7;
                    }
                    aReturn.push("Would you like to purchase more item from the list \n * simoniz car cloths \n * geeky headlamps \n * earbuds \n  : (yes or No)");
                    j++;
                }
                else {
                    this.stateCur = OrderState.TOTALCALC;
                    aReturn.push(`${sInput} is not a valid entry , Please select \n * simoniz car cloths \n * geeky headlamps \n * earbuds `);
                }
                break;

            case OrderState.TOTALCALC:
                if (sInput.toLowerCase() == "yes") {

                    aReturn.push("please select the item \n * simoniz car cloths \n * geeky headlamps \n * earbuds ");
                    this.stateCur = OrderState.UPSELLCHECK;

                }
                else if (sInput.toLowerCase() == "no") {
                    aReturn.push("Thank-you for your order of");
                    for (let k = 0; k < i; k++) {                               
                        aReturn.push(`${ItemsPurchased[k]}`);
                    }
                    for (let L = 0; L < j; L++) {                                  
                        aReturn.push(`${UpSellItem[L]}`);
                    }
                    tax=total*0.13;
                    aReturn.push(`Your total comes to $${total}`);
                    aReturn.push(`Tax $${tax}`);
                    aReturn.push(`we will text you when we are ready to meet you at curbside`)
                    this.isDone(true);
                }

                else {
                    aReturn.push(`${sInput} is not a valid entry , Please select Yes or No `);
                }
                break;
        }
        return aReturn;
    }
    renderForm() {
        // your client id should be kept private
        return (`
      <html>
  <head>
    <meta content="text/html; charset=UTF-8" http-equiv="content-type" />
    <style type="text/css">
      ol {
        margin: 0;
        padding: 0;
      }
      table td,
      table th {
        padding: 0;
      }
      .c2 {
        border-right-style: solid;
        padding: 5pt 5pt 5pt 5pt;
        border-bottom-color: #000000;
        border-top-width: 1pt;
        border-right-width: 1pt;
        border-left-color: #000000;
        vertical-align: top;
        border-right-color: #000000;
        border-left-width: 1pt;
        border-top-style: solid;
        border-left-style: solid;
        border-bottom-width: 1pt;
        width: 234pt;
        border-top-color: #000000;
        border-bottom-style: solid;
      }
      .c10 {
        padding-top: 0pt;
        border-top-width: 0pt;
        border-bottom-width: 0pt;
        padding-bottom: 7pt;
        line-height: 1.15;
        border-bottom-style: solid;
        border-top-style: solid;
        text-align: left;
      }
      .c7 {
        color: #000000;
        font-weight: 700;
        text-decoration: none;
        vertical-align: baseline;
        font-size: 11pt;
        font-family: "Arial";
        font-style: normal;
      }
      .c9 {
        color: #000000;
        font-weight: 400;
        text-decoration: none;
        vertical-align: baseline;
        font-size: 1pt;
        font-family: "Arial";
        font-style: normal;
      }
      .c0 {
        color: #000000;
        font-weight: 400;
        text-decoration: none;
        vertical-align: baseline;
        font-size: 11pt;
        font-family: "Arial";
        font-style: normal;
      }
      .c4 {
        padding-top: 0pt;
        padding-bottom: 0pt;
        line-height: 1.15;
        orphans: 2;
        widows: 2;
        text-align: left;
      }
      .c3 {
        padding-top: 0pt;
        padding-bottom: 0pt;
        line-height: 1;
        text-align: left;
      }
      .c5 {
        border-spacing: 0;
        border-collapse: collapse;
        margin-right: auto;
      }
      .c11 {
        max-width: 468pt;
        padding: 72pt 72pt 72pt 72pt;
      }
      .c8 {
        background-color: #ffffff;
      }
      .c6 {
        height: 11pt;
      }
      .c1 {
        height: 0pt;
      }
      .c12 {
        height: 27.3pt;
      }
      .title {
        padding-top: 0pt;
        color: #000000;
        font-size: 26pt;
        padding-bottom: 3pt;
        font-family: "Arial";
        line-height: 1.15;
        page-break-after: avoid;
        orphans: 2;
        widows: 2;
        text-align: left;
      }
      .subtitle {
        padding-top: 0pt;
        color: #666666;
        font-size: 15pt;
        padding-bottom: 16pt;
        font-family: "Arial";
        line-height: 1.15;
        page-break-after: avoid;
        orphans: 2;
        widows: 2;
        text-align: left;
      }
      li {
        color: #000000;
        font-size: 11pt;
        font-family: "Arial";
      }
      p {
        margin: 0;
        color: #000000;
        font-size: 11pt;
        font-family: "Arial";
      }
      h1 {
        padding-top: 20pt;
        color: #000000;
        font-size: 20pt;
        padding-bottom: 6pt;
        font-family: "Arial";
        line-height: 1.15;
        page-break-after: avoid;
        orphans: 2;
        widows: 2;
        text-align: left;
      }
      h2 {
        padding-top: 18pt;
        color: #000000;
        font-size: 16pt;
        padding-bottom: 6pt;
        font-family: "Arial";
        line-height: 1.15;
        page-break-after: avoid;
        orphans: 2;
        widows: 2;
        text-align: left;
      }
      h3 {
        padding-top: 16pt;
        color: #434343;
        font-size: 14pt;
        padding-bottom: 4pt;
        font-family: "Arial";
        line-height: 1.15;
        page-break-after: avoid;
        orphans: 2;
        widows: 2;
        text-align: left;
      }
      h4 {
        padding-top: 14pt;
        color: #666666;
        font-size: 12pt;
        padding-bottom: 4pt;
        font-family: "Arial";
        line-height: 1.15;
        page-break-after: avoid;
        orphans: 2;
        widows: 2;
        text-align: left;
      }
      h5 {
        padding-top: 12pt;
        color: #666666;
        font-size: 11pt;
        padding-bottom: 4pt;
        font-family: "Arial";
        line-height: 1.15;
        page-break-after: avoid;
        orphans: 2;
        widows: 2;
        text-align: left;
      }
      h6 {
        padding-top: 12pt;
        color: #666666;
        font-size: 11pt;
        padding-bottom: 4pt;
        font-family: "Arial";
        line-height: 1.15;
        page-break-after: avoid;
        font-style: italic;
        orphans: 2;
        widows: 2;
        text-align: left;
      }
    </style>
  </head>
  <body class="c8 c11">
    <p class="c4">
      <span class="c0 c8">Home Hardware @Curbside - Help Screen</span>
    </p>
    <p class="c4 c6"><span class="c0 c8"></span></p>
    <a id="t.6789ca0d78d3028b54a4936866955817fed53272"></a><a id="t.0"></a>
    <table class="c5">
      <tbody>
        <tr class="c1">
          <td class="c2" colspan="1" rowspan="1">
            <p class="c3"><span class="c7">Products </span></p>
          </td>
          <td class="c2" colspan="1" rowspan="1">
            <p class="c3"><span class="c7">Price</span></p>
          </td>
        </tr>
        <tr class="c12">
          <td class="c2" colspan="1" rowspan="1">
            <p class="c10"><span class="c0">Broom</span></p>
          </td>
          <td class="c2" colspan="1" rowspan="1">
            <p class="c3"><span class="c0">$5</span></p>
          </td>
        </tr>
        <tr class="c1">
          <td class="c2" colspan="1" rowspan="1">
            <p class="c3"><span class="c8">Dustbin</span></p>
          </td>
          <td class="c2" colspan="1" rowspan="1">
            <p class="c3"><span class="c0">$10</span></p>
          </td>
        </tr>
        <tr class="c1">
          <td class="c2" colspan="1" rowspan="1">
            <p class="c3"><span class="c8">Snow shovels</span></p>
          </td>
          <td class="c2" colspan="1" rowspan="1">
            <p class="c3"><span class="c0">$15</span></p>
          </td>
        </tr>
        <tr class="c1">
          <td class="c2" colspan="1" rowspan="1">
            <p class="c3">
              <span class="c8">B</span><span class="c8">ulb</span>
            </p>
          </td>
          <td class="c2" colspan="1" rowspan="1">
            <p class="c3"><span class="c0">$8</span></p>
          </td>
        </tr>
        <tr class="c1">
          <td class="c2" colspan="1" rowspan="1">
            <p class="c3">
              <span class="c8">H</span><span class="c8">ousehold cleaners</span>
            </p>
          </td>
          <td class="c2" colspan="1" rowspan="1">
            <p class="c3"><span class="c0">$25</span></p>
          </td>
        </tr>
      </tbody>
    </table>
    <p class="c4 c6"><span class="c0"></span></p>
    <p class="c4">
      <span class="c8"
        >We also have a selection of simoniz car cloths, geeky headlamps,
        earbuds</span
      >
    </p>
  </body>
</html>


       `);

    }
}
