import React from "react";
import { Helmet } from "react-helmet";

const Head = () => {
  return (
    <Helmet>
      <meta charset="utf-8" />
      <link
        rel="apple-touch-icon"
        sizes="76x76"
        href="../assets/img/apple-icon.png"
      />
      <link rel="icon" type="image/png" href="../assets/img/favicon.png" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
      <title>DTMS</title>
      <meta
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, shrink-to-fit=no"
        name="viewport"
      />

      <link
        rel="canonical"
        href="https://www.creative-tim.com/product/material-dashboard-pro"
      />
      <meta
        name="keywords"
        content="creative tim, html dashboard, html css dashboard, web dashboard, bootstrap 4 dashboard, bootstrap 4, css3 dashboard, bootstrap 4 admin, material dashboard bootstrap 4 dashboard, frontend, responsive bootstrap 4 dashboard, material design, material dashboard bootstrap 4 dashboard"
      />
      <meta
        name="description"
        content="Material Dashboard PRO is a Premium Material Bootstrap 4 Admin with a fresh, new design inspired by Google's Material Design."
      />
      <meta itemprop="name" content="Material Dashboard PRO by Creative Tim" />
      <meta
        itemprop="description"
        content="Material Dashboard PRO is a Premium Material Bootstrap 4 Admin with a fresh, new design inspired by Google's Material Design."
      />
      <meta
        itemprop="image"
        content="https://s3.amazonaws.com/creativetim_bucket/products/51/original/opt_mdp_thumbnail.jpg"
      />
      <meta name="twitter:card" content="product" />
      <meta name="twitter:site" content="@creativetim" />
      <meta
        name="twitter:title"
        content="Material Dashboard PRO by Creative Tim"
      />
      <meta
        name="twitter:description"
        content="Material Dashboard PRO is a Premium Material Bootstrap 4 Admin with a fresh, new design inspired by Google's Material Design."
      />
      <meta name="twitter:creator" content="@creativetim" />
      <meta
        name="twitter:image"
        content="https://s3.amazonaws.com/creativetim_bucket/products/51/original/opt_mdp_thumbnail.jpg"
      />
      <meta property="fb:app_id" content="655968634437471" />
      <meta
        property="og:title"
        content="Material Dashboard PRO by Creative Tim"
      />
      <meta property="og:type" content="article" />
      <meta
        property="og:url"
        content="http://demos.creative-tim.com/material-dashboard-pro/examples/dashboard.html"
      />
      <meta
        property="og:image"
        content="https://s3.amazonaws.com/creativetim_bucket/products/51/original/opt_mdp_thumbnail.jpg"
      />
      <meta
        property="og:description"
        content="Material Dashboard PRO is a Premium Material Bootstrap 4 Admin with a fresh, new design inspired by Google's Material Design."
      />
      <meta property="og:site_name" content="Creative Tim" />
      <link
        rel="stylesheet"
        type="text/css"
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Roboto+Slab:400,700|Material+Icons"
      />
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/font-awesome/latest/css/font-awesome.min.css"
      />
      <link
        href="../assets/css/material-dashboard.min.css?v=2.1.0"
        rel="stylesheet"
      />
      <link href="../assets/demo/demo.css" rel="stylesheet" />

      <div>
        <script src="../assets/js/core/jquery.min.js" />
        <script src="../assets/js/core/popper.min.js" />
        <script src="../assets/js/core/bootstrap-material-design.min.js" />
        <script src="../assets/js/plugins/perfect-scrollbar.jquery.min.js" />
        <script src="../assets/js/plugins/moment.min.js" />
        <script src="../assets/js/plugins/sweetalert2.js" />
        <script src="../assets/js/plugins/jquery.validate.min.js" />
        <script src="../assets/js/plugins/jquery.bootstrap-wizard.js" />
        <script src="../assets/js/plugins/bootstrap-selectpicker.js" />
        <script src="../assets/js/plugins/bootstrap-datetimepicker.min.js" />
        <script src="../assets/js/plugins/jquery.dataTables.min.js" />
        <script src="../assets/js/plugins/bootstrap-tagsinput.js" />
        <script src="../assets/js/plugins/jasny-bootstrap.min.js" />
        <script src="../assets/js/plugins/fullcalendar.min.js" />
        <script src="../assets/js/plugins/jquery-jvectormap.js" />
        <script src="../assets/js/plugins/nouislider.min.js" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/core-js/2.4.1/core.js" />
        <script src="../assets/js/plugins/arrive.min.js" />
        <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB2Yno10-YTnLjjn_Vtk0V8cdcY5lC4plU" />
        <script async defer src="https://buttons.github.io/buttons.js" />
        <script src="../assets/js/plugins/chartist.min.js" />
        <script src="../assets/js/plugins/bootstrap-notify.js" />
        <script
          src="../assets/js/material-dashboard.min.js?v=2.1.0"
          type="text/javascript"
        />
        <script src="../assets/demo/demo.js" />
      </div>

      {/* <script>
    (function (w, d, s, l, i) {
      w[l] = w[l] || [];
      w[l].push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js'
      });
      var f = d.getElementsByTagName(s)[0],
        j = d.createElement(s),
        dl = l != 'dataLayer' ? '&l=' + l : '';
      j.async = true;
      j.src =
        'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
      f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', 'GTM-NKDMSK6');
  </script> */}
    </Helmet>
  );
};

export default Head;
