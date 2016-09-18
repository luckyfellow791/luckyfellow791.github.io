jQuery(document).ready(function($){
    var tickets = [];
    var cartWrapper = $('.cd-cart-container');
    //product id - you don't need a counter in your real project but you can use your real product id
    var productId = 0;
    var products = [];

    if( cartWrapper.length > 0 ) {
	//store jQuery objects
	var cartBody = cartWrapper.find('.body');
	var cartList = cartBody.find('ul').eq(0);
	var cartTotal = cartWrapper.find('.checkout').find('span');
	var cartTrigger = cartWrapper.children('.cd-cart-trigger');
	var cartCount = cartTrigger.children('.count');
	var addToCartBtn = $('.cd-add-to-cart');
	var undo = cartWrapper.find('.undo');
	var undoTimeoutId;

	//add product to cart
	addToCartBtn.on('click', function(event){
	    event.preventDefault();
	    addToCart($(this));
	});

	//open/close cart
	cartTrigger.on('click', function(event){
	    event.preventDefault();
	    toggleCart();
	});

	//close cart when clicking on the .cd-cart-container::before (bg layer)
	cartWrapper.on('click', function(event){
	    if( $(event.target).is($(this)) ) toggleCart(true);
	});

	//delete an item from the cart
	cartList.on('click', '.delete-item', function(event){
	    event.preventDefault();
	    removeProduct($(event.target).parents('.product'));
	});

	//update item quantity
	cartList.on('change', 'select', function(event){
	    quickUpdateCart();
	});

	//reinsert item deleted from the cart
	undo.on('click', 'a', function(event){
	    clearInterval(undoTimeoutId);
	    event.preventDefault();
	    cartList.find('.deleted').addClass('undo-deleted').one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(){
		$(this).off('webkitAnimationEnd oanimationend msAnimationEnd animationend').removeClass('deleted undo-deleted').removeAttr('style');
		quickUpdateCart();
	    });
	    undo.removeClass('visible');
	});
    }

    function toggleCart(bool) {
	var cartIsOpen = ( typeof bool === 'undefined' ) ? cartWrapper.hasClass('cart-open') : bool;
	
	if( cartIsOpen ) {
	    cartWrapper.removeClass('cart-open');
	    //reset undo
	    clearInterval(undoTimeoutId);
	    undo.removeClass('visible');
	    cartList.find('.deleted').remove();

	    setTimeout(function(){
		cartBody.scrollTop(0);
		//check if cart empty to hide it
		if( Number(cartCount.find('li').eq(0).text()) == 0) cartWrapper.addClass('empty');
	    }, 500);
	} else {
	    cartWrapper.addClass('cart-open');
	}
    }

    function addToCart(trigger) {
	var cartIsEmpty = cartWrapper.hasClass('empty');
	//update cart product list
        if (products.length > 0) {
            alert("Sorry, you can buy only one ticket at a time.");
            return;
        }
        var validTicket = validateTickets(tickets);
        if (validTicket === false) {
            alert("You have to pick 5 numbers in the lottery.");
            return;
        }
	addProduct();
	//update number of items 
	updateCartCount(cartIsEmpty);
	//update total price
	updateCartTotal(trigger.data('price'), true);
	//show cart
	cartWrapper.removeClass('empty');
    }
    
    function listoChild(ticketLength) {
        return "nth-child(" + ticketLength + ")";
    }

    function isInArray(value, array) {
        return array.indexOf(value) > -1;
    }

    function getTicketName(tickets) {
        return tickets.reduce(function(acc, elem) {
            return acc + "-" + elem;
        });
    }

    $('.lottery-numbers button').click(function(){
	$(this).toggleClass('active');
	var content = $(this).text();
        var ticketIndex = tickets.indexOf(content);
        console.log(ticketIndex, content, tickets);
        if (ticketIndex > -1) {
            // ticket is already selected
            tickets.splice(ticketIndex, 1);
            console.log('b4 tickets', tickets);
            for (var i =0; i<5; i++) {
                console.log('jifa', tickets, i, tickets[i]);
                var childAccessor = listoChild(i + 1);
                if (tickets[i] === undefined) {
                    console.log('accc', childAccessor);
                    $('.lottery-selected-num span:' + childAccessor).text('--');    
                }                
                else {
                    $('.lottery-selected-num span:' + childAccessor).text(tickets[i]);   
                }
            }
            return;
        }
        if (tickets.length >= 5) {
            alert("You can pick only 5 numbers");
            return;
        }
        if (ticketIndex === -1) {
            tickets.push(content);
            var childAccessor = listoChild(tickets.length);
	    $('.lottery-selected-num span:' + childAccessor).text(content);
        }
        
        console.log(tickets);
    });

    function validateTickets(tickets) {
        return tickets.length === 5;
    }

    function changeInstaLink(ticketNo) {
        var id = "instamojo";
        var checkoutLink = document.getElementById(id);
        checkoutLink.href = checkoutLink.href + "&data_Field_78960=" + ticketNo;
    }

    function addProduct() {
	//this is just a product placeholder
	//you should insert an item with the selected product info
	//replace productId, productName, price and url with your real product info

	productId = productId + 1;
        products.push(productId);
        var ticketName = getTicketName(tickets);
	var productAdded = $('<li class="product"><div class="product-details"><h3><a href="#0">' + ticketName + '</a></h3><div class="actions"><a href="#0" class="delete-item">Delete</a></div><span class="priceDef"><span class="tit">Lottery Price</span> <span class="val">Rs.100.00</span> <span class="tit">Convenience charges</span> <span class="val">Rs.5.00</span></span><span class="price">Rs.105.00</span><div class="actions" style="display:none;"><div class="quantity"><label for="cd-product-'+ productId +'">Qty</label><span class="select"><select id="cd-product-'+ productId +'" name="quantity"><option value="1">1</option></select></span></div></div></div></li>');
	cartList.prepend(productAdded);
        changeInstaLink(ticketName);
    }

    function removeProduct(product) {
	clearInterval(undoTimeoutId);
	cartList.find('.deleted').remove();
	
	var topPosition = product.offset().top - cartBody.children('ul').offset().top ,
	    productQuantity = Number(product.find('.quantity').find('select').val()),
	    productTotPrice = Number(product.find('.price').text().replace('Rs.', '')) * productQuantity;
	
	product.css('top', topPosition+'px').addClass('deleted');

	//update items count + total price
	updateCartTotal(productTotPrice, false);
	updateCartCount(true, -productQuantity);
	undo.addClass('visible');

	//wait 8sec before completely remove the item
	undoTimeoutId = setTimeout(function(){
	    undo.removeClass('visible');
	    cartList.find('.deleted').remove();
	}, 8000);
    }

    function quickUpdateCart() {
	var quantity = 0;
	var price = 0;
	
	cartList.children('li:not(.deleted)').each(function(){
	    var singleQuantity = Number($(this).find('select').val());
	    quantity = quantity + singleQuantity;
	    price = price + singleQuantity*Number($(this).find('.price').text().replace('Rs', ''));
	});

	cartTotal.text(price.toFixed(2));
	cartCount.find('li').eq(0).text(quantity);
	cartCount.find('li').eq(1).text(quantity+1);
    }

    function updateCartCount(emptyCart, quantity) {
	if( typeof quantity === 'undefined' ) {
	    var actual = Number(cartCount.find('li').eq(0).text()) + 1;
	    var next = actual + 1;
	    
	    if( emptyCart ) {
		cartCount.find('li').eq(0).text(actual);
		cartCount.find('li').eq(1).text(next);
	    } else {
		cartCount.addClass('update-count');

		setTimeout(function() {
		    cartCount.find('li').eq(0).text(actual);
		}, 150);

		setTimeout(function() {
		    cartCount.removeClass('update-count');
		}, 200);

		setTimeout(function() {
		    cartCount.find('li').eq(1).text(next);
		}, 230);
	    }
	} else {
	    var actual = Number(cartCount.find('li').eq(0).text()) + quantity;
	    var next = actual + 1;
	    
	    cartCount.find('li').eq(0).text(actual);
	    cartCount.find('li').eq(1).text(next);
	}
    }

    function updateCartTotal(price, bool) {
	bool ? cartTotal.text( (Number(cartTotal.text()) + Number(price)).toFixed(2) )  : cartTotal.text( (Number(cartTotal.text()) - Number(price)).toFixed(2) );
    }
});
