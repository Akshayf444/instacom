<div class="row">
    <div class="col-lg-12">
        <h3>Number Count : <?php echo $count['count_contact']?></h3>
    </div>
</div>
<div class="row">
    <div class="col-lg-12">
        <table class="table table-bordered table-striped">
            <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Mobile</th>
            </tr>
            <?php foreach ($list as $li):?>
            <tr>
                <td><?php echo $li->fname?></td>
                <td><?php echo $li->lname?></td>
                <td><?php echo $li->mobile?></td>
            </tr>
            <?php endforeach;?>
        </table>
    </div>
</div>

