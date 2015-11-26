<style>
    .btn-block{
        background:url('<?php echo asset_url()?>images/Jardiance _Button.png') no-repeat center;
        color: #000;
        background-size: 100%;
    }
</style>

<div class="container-fluid" >
    <div class="row">
        <div class="col-lg-12">
            <div class="form-group">
                <a href="<?php echo site_url('Doctors/add')?>" class="btn btn-success btn-lg btn-block">Enter Doctor Details</a>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-lg-12">
            <div class="form-group">
                <a href="<?php echo site_url('Doctors/doctorlist')?>" class="btn btn-success btn-lg btn-block">View Doctor Details</a>
            </div>
        </div>
    </div>
</div>

<!--<div class="col-lg-10">
    <button type="button" class="btn btn-primary pull-right" data-toggle="modal" data-target="#myModal">
        Help
    </button>
</div>-->
<!-- Modal -->
<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">         
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="myModalLabel">Help</h4>
            </div>
            <div class="modal-body">
                <p  style="text-align: center";> For Any Query Regarding The Reporting,Please Contact<b> 022-65657701</b></p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>

            </div>
        </div>
    </div>
</div>