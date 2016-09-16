<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">

<head>

    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>Daddy Design - Custom iFrame Share Button - Demo</title>
    
    <link href="style.css" rel="stylesheet" type="text/css" media="screen" />
    
    <base target='_blank' />

</head>

<body>

<div class="wrapper">
    	<div class="top">
        	<img src="images/dd_logo.jpg" alt="" />
        </div>
        <div class="body">

            <div id="button">
                <?php
                    $title=urlencode('Title of Your iFrame Tab');
                    $url=urlencode('http://www.facebook.com/yourfanpage');
                    $summary=urlencode('Custom message that summarizes what your tab is about, or just a simple message to tell people to check out your tab.');
                    $image=urlencode('http://www.yourdomain.com/facebookshare/images/customthumbnail.jpg');
                ?>
                <a onClick="window.open('http://www.facebook.com/sharer.php?s=100&amp;p[title]=<?php echo $title;?>&amp;p[summary]=<?php echo $summary;?>&amp;p[url]=<?php echo $url; ?>&amp;&p[images][0]=<?php echo $image;?>', 'sharer', 'toolbar=0,status=0,width=548,height=325');" target="_parent" href="javascript: void(0)">
                	Share our Facebook page!
                </a>
            </div>
            
            <div class="goback">
                <p><a href="http://www.daddydesign.com/wordpress/how-to-create-a-custom-facebook-share-button-for-your-iframe-tab/">
                    Go back to reading<br />
                    "How to Create a Custom Facebook Share Button for Your iFrame Tab"
                </a></p>
            </div>
            
                </div>
    <div class="footer">
        <p>&copy; Copyright 2011 <a href="http://www.daddydesign.com/">Daddy Design</a>. All Rights Reserved.</p>
    </div>
</div>

</body>
</html>
