<div class="login-box">
    <div class="login-logo">
        <a href="../../index2.html"><b>Instacom</b>Messanger</a>
    </div><!-- /.login-logo -->
    <div class="login-box-body">
        <p class="login-box-msg">Register Here</p>
        <?php form_open('Users/register'); ?>
        <div class="form-group has-feedback">
            <input type="email" class="form-control" placeholder="Email"/>
            <span class="glyphicon glyphicon-envelope form-control-feedback"></span>
        </div>
        <div class="row">
            <div class="col-xs-8">    
                       
            </div><!-- /.col -->
            <div class="col-xs-4">
                <button type="submit" class="btn btn-primary btn-block btn-flat">Register</button>
            </div><!-- /.col -->
        </div>
        </form>

        <a href="<?php echo site_url('Users/login'); ?>" class="text-center">Sign In</a>

    </div><!-- /.login-box-body -->
</div><!-- /.login-box -->