<div class="row">
    <div class="col-lg-12">
        <a href="<?php echo site_url('Contact/Add_contact'); ?>"><button class="btn btn-success pull-right">Add Contact</button></a>
    </div>
</div>
<div class="row">
    <div class="col-lg-2"></div>
    <table  class="col-lg-6 table table-bordered table-responsive table-striped">
        <tr>
            <th><label class="control-label">Mobile</label></th>
            <th><label class="control-label">First Name</label></th>
            <th><label class="control-label">Last Name</label></th>


        </tr>
        <?php foreach ($show as $sh) :
            ?>
            <tr>
                <td><?php echo $sh->mobile; ?></td>
                <td><?php echo $sh->fname; ?></td>
                <td><?php echo $sh->lname; ?></td>

            </tr>            
        <?php endforeach ?>
    </table>
</div>