<style>
    .row-margin-top{
        margin-top: 1em;
    }
    .bgc-fff {
        background-color: #FFF;
    }
    .box-shad {
        -webkit-box-shadow: 1px 1px 0 rgba(0,0,0,.2);
        box-shadow: 1px 1px 0 rgba(0,0,0,.2);
    }
    .brdr {
        border: 1px solid #ededed;
    }

    /* Font changes */
    .fnt-smaller {
        font-size: 1em;
        padding-top: 5px;
    }
    .fnt-lighter {
        color: #499E37;
    }

    /* Padding - Margins */
    .pad-10 {
        padding: 5px!important;
    }
    .mrg-0 {
        margin: 0!important;
    }
    .btm-mrg-10 {
        margin-bottom: 10px!important;
    }
    .btm-mrg-20 {
        margin-bottom: 20px!important;
    }

    /* Color  */
    .clr-535353 {
        color: #535353;
    }
</style>

<div class="col-lg-12">
    <h3 >List Of Doctors</h3>
</div>      <!-- /.col-lg-12 -->



<?php
if (!empty($doctors)) {
    foreach ($doctors as $doctor) {
        ?>
        <div class="col-sm-12"> 
            <div class="brdr bgc-fff pad-10 box-shad btm-mrg-20 property-listing">
                <div class="media">
                    <div class="row">
                        <div class="col-lg-12">
                            <h4 class="media-heading">
                                <a href=""><?php echo $doctor->fname . " " . $doctor->lname; ?></a>
                            </h4>
                            <div class="row row-margin-top" >
                                <div class="col-lg-6" >
                                    <b>Speciality : </b><?php echo $doctor->speciality ?>
                                </div>
                                <div class="col-lg-6" >
                                    <b>Mobile No : </b><?php echo $doctor->mobile ?>
                                </div>
                                <div class="col-lg-6" >
                                    <b>Unnati ID : </b><?php echo $doctor->unnati_id ?>
                                </div>
                                <div class="col-lg-6" >
                                    <b>Place : </b><?php echo $doctor->place; ?>
                                </div>
                                <div class="col-lg-6" >
                                    <b>Class : </b><?php echo $doctor->class; ?>
                                    <a href="<?php echo site_url('Doctors/edit/' . $doctor->docid) ?>" class="btn btn-warning btn-xs pull-right">EDIT</a>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
        <?php
    }
}
?>