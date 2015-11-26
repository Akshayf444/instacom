<div class="modal" data-show="true" id="myModal" data-backdrop="static" data-keyboard="false">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">

                <h4 class="modal-title">Please Enter Your Mobile No</h4>
            </div>
            <?php
            $attributes = array('id' => 'completeProfile');
            echo form_open('Users/completeProfile', $attributes);
            ?>
            <div class="modal-body">

                <div><label for="mobile">10 Digit Mobile No*</label> <input type="text" pattern="[0-9]{10}" id='mobile' name="mobile" required class="form-control" value="<?php
                    if (isset($mobile)) {
                        echo $mobile;
                    }
                    ?>" maxlength="10"/> </div>
            </div>
            <div class="modal-footer">
                <a href="<?php echo site_url('Users/logout') ?>" class="btn btn-danger">Cancel</a>
                <button type="submit" class="btn btn-primary" onclick="validate()" name="submit">Save changes</button>
            </div>
            </form>
        </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</div><!-- /.modal -->
<script>
    $(document).ready(function () {
        $('#myModal').modal('show');
        $('#myModal').modal({
            backdrop: 'static',
            keyboard: false
        })
    });

    function validate() {
        var mobile = $("#mobile").val();
        var regex = new RegExp("/^\d{10}$/");
        if (regex.test(mobile) == false) {
            //alert('Please Enter Valid mobile no.');
            return false;
        }
    }
</script>