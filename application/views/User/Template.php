<div class="row">
    <div class="col-lg-12">
        <h3 class="page-header">Template</h3>
    </div>
</div>

<div class="row">
    <div class="col-lg-12">

        <div class="row">
            <div class="col-sm-12">
                <a class="btn btn-success  pull-right" href="<?php echo site_url() ?>/Contact/Create_Template">Create New Template</a>
            </div>
            <!--                    <div class="col-sm-4">
                                    <a class="btn btn-success" href="#">Edit Template</a>
                                </div>
                                <div class="col-sm-4">
                                    <a class="btn btn-success" href="#">Delete Template</a>
                                </div>-->
        </div>

    </div>

</div>
<div class="row">
    <div class="col-lg-1"></div>
    <div class="col-lg-10">
        <table class="table table-bordered table-striped">
            <tr>
                <th>Title</th>
                <th>Message</th>
                <th>Date</th>
            </tr>
            <?php foreach ($show as $sh):?>
            <tr>
                <td><?php echo $sh->title?></td>
                <td><?php echo $sh->message?></td>
                <td><?php echo $sh->created?></td>
            </tr>
            <?php endforeach;?>
        </table>
    </div>
    <div class="col-lg-1"></div>
</div>