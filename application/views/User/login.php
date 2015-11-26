<div class="login-box">
    <div class="login-logo">
        <a href="../../index2.html"><b>Instacom</b>Messanger</a>
    </div><!-- /.login-logo -->
    <div class="login-box-body">
        <p class="login-box-msg">Sign in to start your session</p>
        <?php form_open('Users/login'); ?>
        <div class="form-group has-feedback">
            <input type="text" class="form-control" placeholder="Email"/>
            <span class="glyphicon glyphicon-envelope form-control-feedback"></span>
        </div>
        <div class="form-group has-feedback">
            <input type="password" class="form-control" placeholder="Password"/>
            <span class="glyphicon glyphicon-lock form-control-feedback"></span>
        </div>
        <div class="row">
            <div class="col-xs-8">    
                       
            </div><!-- /.col -->
            <div class="col-xs-4">
                <button type="submit" class="btn btn-primary btn-block btn-flat">Sign In</button>
            </div><!-- /.col -->
        </div>
        </form>
        <a href="#">I forgot my password</a><br>
        <a href="<?php echo site_url('Users/register');?>" class="text-center">Register a new membership</a>

    </div><!-- /.login-box-body -->
</div><!-- /.login-box -->