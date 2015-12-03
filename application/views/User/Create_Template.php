<div class="row">
    <div class="col-lg-12">
        <h3 class="page-header">Create Template</h3>
    </div>
</div>
<div class="row">
    <div class="col-lg-2"></div>
    <div class="col-lg-8">
        <div class="panel panel-default">
            <div class="panel panel-body">
                <?php echo form_open('Contact/Create_Template') ?>
                <div class="row">
                    <div class="col-lg-1"></div>
                    <div class="col-lg-10">                    
                        <div class="form-group">
                            <lable class="control-label">Title</lable>
                            <input type="text" class="form-control" name="title" placeholder="Enter Title"/>
                        </div>


                    </div>
                    <div class="col-lg-1"></div>
                </div>
                <div class="row">
                    <div class="col-lg-1"></div>
                    <div class="col-lg-10">                    
                        <div class="form-group">
                            <a class="btn btn-primary" id="first" name="first">First Name</a>
                            <a class="btn btn-primary" id="last" name="last">Last Name</a>
                        </div>


                    </div>
                    <div class="col-lg-1"></div>
                </div>
                <div class="row">
                    <div class="col-lg-1"></div>
                    <div class="col-lg-10">                    
                        <div class="form-group">
                            <lable class="control-label">Message</lable>
                            <textarea class="form-control" name="message" id="message"></textarea>
                        </div>


                    </div>
                    <div class="col-lg-1"></div>
                </div>
                <div class="row">
                    <div class="col-lg-1"></div>
                    <div class="col-lg-10"> 
                        <input type="submit" class="btn btn-success pull-right" value="Create"/>
                    </div>
                    <div class="col-lg-1"></div>
                </div>
                </form>
            </div>
            <div class="col-lg-2"></div>
        </div>
        <script>
            $(document).ready(function () {
                $('#first').click(function () {
                    $('#message').append('#FirstName#');
                })
                $('#last').click(function () {
                    $('#message').append('#LastName#');
                })
            })
        </script>