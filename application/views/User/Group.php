<div class="row">
    <div class="col-lg-12">
        <h3 class="page-header">Groups</h3>
    </div>

</div>
<div class="row">
    <div class="col-lg-12">
        <button style="    margin: 0px 0px 10px 0px;" type="button" class="btn btn-primary" data-toggle="modal" data-target="#customer" >Create group</button>
    </div>
</div>
<div class="row">
    <div class="col-lg-12">
        <?php foreach($list as $li): ?>
        <div class="panel panel-default">
            <div class="panel panel-body">
                <a href="<?php echo site_url();?>/Contact/group_inside?id=<?php echo $li->id?>"><h4><?php echo $li->group_name?></h4></a>
            </div>
        </div>
        <?php endforeach; ?>
    </div>
</div>

<div  class="modal fade " tabindex="-1" role="dialog" aria-labelledby="ModalLabel" id="customer" aria-hidden="true">
    <div style="width:40%;" class="modal-dialog ">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="exampleModalLabel"> Create Group</h4>
            </div>
            <div class="row">
                <div class="modal-body">
                    <?php echo form_open('Contact/create_group2') ?>
                    <div class="col-lg-12">

                        <div class="col-lg-12">


                            <div class=" form-group">

                                Name: <span class="error">*</span> <input type="text" class="form-control" name="name" placeholder="Enter Group Name"/>
                            </div>


                        </div>

                    </div>


                </div>




                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                    <input type="submit"  name="save" value="save" class="btn btn-primary"/ >

                </div>
                </form>

            </div>
        </div>
    </div>
</div>