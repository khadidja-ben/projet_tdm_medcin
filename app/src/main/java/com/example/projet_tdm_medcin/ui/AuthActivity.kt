package com.example.projet_tdm_medcin.ui

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.example.projet_tdm_medcin.R
import kotlinx.android.synthetic.main.activity_auth.*

class AuthActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_auth)

        login_button.setOnClickListener(){
            val pref = applicationContext.getSharedPreferences("myPrefs", MODE_PRIVATE)
            val editor = pref.edit()
            editor.putBoolean("connected", true)
            editor.commit()

            val mainActivity = Intent(applicationContext, MainActivity::class.java)
            startActivity(mainActivity)
            finish()
        }
    }
}